import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  Spinner,
  Alert
} from "react-bootstrap";
import { RequestService } from "../../services";
import { Request } from "../../services/models/Request";
import { AttachmentTypes as attachmentTypes } from "../../constants/AttachmentTypes";
import { getRandomString } from "@pnp/common";
import { Attachment } from "../../services/models/SharepointAttachments";

interface IProps {
  open: boolean;
  onHide: () => void;
  request: Request;
  onUploadSuccessful: (attachment: Attachment) => void;
}

export const UploadAttachmentModal = (props: IProps) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [selectedType, setSelectedType] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState(undefined);
  const svc = new RequestService();

  useEffect(() => {
    setSelectedFile(undefined);
    setSelectedType("");
    setUploading(false);
    setError(undefined);
  }, [props.open]);

  const onFileTypeChanged = (e: any) => {
    if (e && e.target && e.target.value) {
      setSelectedType(e.target.value);
    }
  };

  const onFileSelected = (e: any) => {
    if (e && e.target && e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  //remove non-sharepoint friendly stuff from the file name
  const cleanFileName = (fileName: string): string => {
    const notAllowedRegExp = /[^a-zA-Z0-9.]|(files|file|Dateien|fichiers|bestanden|archivos|filer|tiedostot|pliki|soubory|elemei|ficheiros|arquivos|dosyalar|datoteke|fitxers|failid|fails|bylos|fajlovi|fitxategiak)$/;
    const clean = fileName.replace(notAllowedRegExp, "_");
    return clean;
  };

  //adds some random characters before the file extension so sharepoint
  //doesn't complain if there's another file with the same name.
  //coincidentally this is also where we store the file type...
  //just to keep things the same as the legacy app
  const renameFile = (fileName: string, fileType: string): string => {
    let clean = cleanFileName(fileName);
    const split = clean.split(".");
    const ext = split.pop();
    const name = split.join(".");
    const rand = getRandomString(8).toLowerCase();
    return `${fileType}-${name}-${rand}.${ext}`;
  };

  const uploadClicked = () => {
    if (selectedFile) {
      setUploading(true);
      const fileName = renameFile(selectedFile.name, selectedType);
      svc.uploadAttachment(props.request, fileName, selectedFile).subscribe(
        result => {
          setUploading(false);
          props.onUploadSuccessful(result.data as Attachment);
          props.onHide();
        },
        error => {
          setUploading(false);
          setError(error);
          console.error(error);
        }
      );
    }
  };

  return (
    <Modal show={props.open} onHide={props.onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Attachment</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <Alert variant="danger">
            <Alert.Heading>Error Uploading</Alert.Heading>
            <p>{JSON.stringify(error, null, 2)}</p>
          </Alert>
        )}
        <Form.Group>
          <Form.Label>Attachment Type</Form.Label>
          <Form.Control
            className="custom-select"
            as="select"
            disabled={uploading}
            onChange={onFileTypeChanged}
          >
            <option value={""}>Select one</option>
            {attachmentTypes.map(type => {
              return (
                <option value={type} key={type}>
                  {type}
                </option>
              );
            })}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Attachment</Form.Label>
          <InputGroup>
            <Form.Control
              disabled={uploading}
              className="custom-file-input"
              as="input"
              type="file"
              id="fileInput"
              onChange={onFileSelected}
            />
            <Form.Label className="custom-file-label">
              {selectedFile ? selectedFile.name : ""}
            </Form.Label>
          </InputGroup>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={() => props.onHide()}
          disabled={uploading}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => uploadClicked()}
          disabled={uploading || !selectedFile || !selectedType}
        >
          {uploading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}{" "}
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
