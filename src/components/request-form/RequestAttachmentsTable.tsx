import React, { useEffect, useState } from "react";
import { Request } from "../../services/models/Request";
import { Attachment } from "../../services/models/SharepointAttachments";
import { Table, Form, Button } from "react-bootstrap";
import { RequestService } from "../../services/RequestService";
import { AttachmentTypes as attachmentTypes } from "../../constants/AttachmentTypes";
import { UploadAttachmentModal } from "./UploadAttachmentModal";
import { FaTimes } from "react-icons/fa";
import { ConfirmationModal } from "./ConfirmationModal";
import { useToasts } from "react-toast-notifications";
interface IProps {
  request: Request;
  editing: boolean;
}
export const RequestAttachmentsTable = (props: IProps) => {
  const svc = new RequestService();
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment>();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentModalOpen, setAttachmentModalOpen] = useState<boolean>(
    false
  );
  const { addToast } = useToasts();

  const possibleTypes = new Set(attachmentTypes);

  useEffect(() => {
    getAttachments();
  }, []);

  const getAttachments = () => {
    svc.getAttachments(props.request).subscribe((response: Attachment[]) => {
      setAttachments(response);
    });
  };

  const onDeleteSelectedAttachment = () => {
    if (selectedAttachment) {
      addToast("Deleting...", {
        appearance: "info",
        autoDismiss: true
      });
      svc
        .deleteAttachment(props.request, selectedAttachment.FileName)
        .subscribe(
          () => {
            const array = [...attachments];
            array.splice(attachments.indexOf(selectedAttachment), 1);
            setAttachments(array);
            addToast("Attachment deleted", {
              appearance: "success",
              autoDismiss: true
            });
          },
          (error: any) => {
            addToast("Delete failed", {
              appearance: "error",
              autoDismiss: false
            });
            console.error(error);
          }
        );
    }
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>File name</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {attachments &&
            attachments.map(attachment => {
              const split = attachment.FileName.split("-");
              const attachmentType = split[0];
              return (
                <tr key={attachment.FileName}>
                  <td>
                    <a href={`${attachment.ServerRelativeUrl}`}>
                      {attachment.FileName}
                    </a>
                  </td>
                  <td>
                    {possibleTypes.has(attachmentType)
                      ? attachmentType
                      : "Other"}
                  </td>
                  <td style={{ width: "1%" }}>
                    <span className="text-danger">
                      <FaTimes
                        title="Delete this file"
                        style={{
                          cursor: "pointer",
                          display: props.editing ? "inline" : "none"
                        }}
                        onClick={() => {
                          setSelectedAttachment(attachment);
                          setDeleteModalOpen(true);
                          return;
                        }}
                      />
                    </span>
                  </td>
                </tr>
              );
            })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} align="right">
              <Button
                disabled={!props.editing}
                variant="outline-primary"
                onClick={() => setAttachmentModalOpen(true)}
              >
                Upload
              </Button>
            </td>
          </tr>
        </tfoot>
      </Table>
      <UploadAttachmentModal
        open={attachmentModalOpen}
        onHide={() => setAttachmentModalOpen(false)}
        request={props.request}
        onUploadSuccessful={(attachment: Attachment) =>
          setAttachments([...attachments, attachment])
        }
      />
      <ConfirmationModal
        open={deleteModalOpen}
        onHide={() => setDeleteModalOpen(false)}
        onConfirm={() => onDeleteSelectedAttachment()}
        title="Delete Attachment"
        body="Are you sure you want to delete this attachment?"
        confirmText="Yes"
        cancelText="No"
      />
    </>
  );
};
