import React from "react";
import {
  Page,
  View,
  Document,
  StyleSheet,
  Text,
  Link
} from "@react-pdf/renderer";
import { Request } from "../../services/models/Request";
import { LineItem } from "../../services/models/LineItem";
import { Attachment } from "../../services/models/SharepointAttachments";
import { AttachmentTypes as attachmentTypes } from "../../constants/AttachmentTypes";
import { useActionBadges } from "../approval-action-badge/ApprovalActionBadgeBar";
import { getStatusesByFriendlyName } from "../../constants/StepStatus";
import { ApprovalAction } from "../../services/models/ApprovalAction";
import { format, parseISO } from "date-fns";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4"
  },
  section: {
    margin: 1,
    padding: 5
  },
  header: {
    padding: 10,
    backgroundColor: "#ccc"
  },
  label: {
    fontSize: 12,
    backgroundColor: "#f2f2f2",
    padding: 2,
    margin: 1
  },
  value: {
    fontSize: 9,
    padding: 2,
    margin: 1
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    marginBottom: 10
  },
  col: {
    display: "flex",
    flexDirection: "column",
    flexBasis: 100,
    flex: 1
  },
  table: {
    display: "flex",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row"
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10
  },
  tableCellHead: {
    fontSize: 10,
    backgroundColor: "#f2f2f2",
    padding: 2
  }
});

interface IProps {
  request: Request;
  attachments: Attachment[];
}

export const RequestPdf = (props: IProps) => {
  const possibleAttachmentTypes = new Set(attachmentTypes);
  const badges = useActionBadges(props.request, "auto", true, [
    "Draft",
    "Closed"
  ]);
  const statuses = Object.keys(getStatusesByFriendlyName());
  const getActions = (): Array<ApprovalAction | null> => {
    let actions: Array<ApprovalAction | null> = [];
    statuses.map(status => {
      const action = props.request.getLastActionFor(status, [
        "approve",
        "sendto",
        "reject"
      ]);
      //we'll access this from the signatures table
      if (action) {
        action.formInputs["status"] = status;
      }
      actions.push(action);
    });
    return actions;
  };

  return (
    <Document>
      <Page size="A4">
        <View fixed style={styles.section}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text
                style={styles.header}
              >{`GPC Request #${props.request.id}`}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={{ ...styles.label, fontSize: 18 }}>
                  Request Data
                </Text>
              </View>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Requestor</Text>
              <Text style={styles.value}>{props.request.author.Title}</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Requestor DSN</Text>
              <Text style={styles.value}>
                {props.request.requestField.RequestorDSN}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Card Type</Text>
              <Text style={styles.value}>
                {props.request.requestField.RequestCardType}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Directorate</Text>
              <Text style={styles.value}>
                {props.request.requestField.RequestorDirectorate}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Cardholder</Text>
              <Text style={styles.value}>
                {props.request.requestField.RequestorCardHolderName}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Funding</Text>
              <Text style={styles.value}>
                {props.request.requestField.RequestSource}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Request Date</Text>
              <Text style={styles.value}>
                {props.request.created &&
                  format(parseISO(props.request.created), "dd MMM yyyy")}
              </Text>
            </View>
            <View style={styles.col}></View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Justification</Text>
              <Text style={styles.value}>
                {props.request.requestField.RequestJustification}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>
                Includes hardware, software, or IT services
              </Text>
              <Text style={styles.value}>
                {props.request.requestField.RequestIsJ6}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Currency</Text>
              <Text style={styles.value}>
                {props.request.requestField.RequestCurrencyType}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={{ ...styles.label, fontSize: 18 }}>
                  Line Items
                </Text>
              </View>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead,
                    width: "10%"
                  }}
                >
                  <Text style={styles.tableCell}>Qty</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead
                  }}
                >
                  <Text style={styles.tableCell}>Description</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead
                  }}
                >
                  <Text style={styles.tableCell}>Vendor</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead,
                    width: "12%"
                  }}
                >
                  <Text style={styles.tableCell}>Cost</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead,
                    width: "8%"
                  }}
                >
                  <Text style={styles.tableCell}>DD-250</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead,
                    width: "8%"
                  }}
                >
                  <Text style={styles.tableCell}>DD-2062</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead,
                    width: "12%"
                  }}
                >
                  <Text style={styles.tableCell}>Total</Text>
                </View>
              </View>
              {props.request.lineItems.map((line: LineItem, index: number) => {
                return (
                  <View style={styles.tableRow} key={line.id}>
                    <View style={{ ...styles.tableCol, width: "10%" }}>
                      <Text style={styles.tableCell}>{line.requestQty}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{line.requestDesc}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{line.requestSrc}</Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "12%" }}>
                      <Text style={styles.tableCell}>
                        {props.request.formatAmount(line.requestCost)}
                      </Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "8%" }}>
                      <Text style={styles.tableCell}>
                        {line.requestDdForm ? "Yes" : "No"}
                      </Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "8%" }}>
                      <Text style={styles.tableCell}>
                        {line.requestDaForm ? "Yes" : "No"}
                      </Text>
                    </View>
                    <View style={{ ...styles.tableCol, width: "12%" }}>
                      <Text style={styles.tableCell}>
                        {props.request.formatAmount(line.requestTotal)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
            <View style={styles.row}>
              <View style={{ ...styles.col, alignItems: "flex-end" }}>
                <Text style={{ ...styles.value, fontSize: 12 }}>
                  {props.request.formatAmount(props.request.getTotal())}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={{ ...styles.label, fontSize: 18 }}>
                  Attachments
                </Text>
              </View>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead,
                    width: "75%"
                  }}
                >
                  <Text style={styles.tableCell}>File name</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead,
                    width: "25%"
                  }}
                >
                  <Text style={styles.tableCell}>Type</Text>
                </View>
              </View>
              {props.attachments.map(
                (attachment: Attachment, index: number) => {
                  const split = attachment.FileName.split("-");
                  const attachmentType = split[0];
                  return (
                    <View style={styles.tableRow} key={`attachment-${index}`}>
                      <View style={{ ...styles.tableCol, width: "75%" }}>
                        <Text style={styles.tableCell}>
                          <Link
                            src={`${window.location.protocol}//${window.location.host}${attachment.ServerRelativeUrl}`}
                          >
                            {attachment.FileName}
                          </Link>
                        </Text>
                      </View>
                      <View style={{ ...styles.tableCol, width: "25%" }}>
                        <Text style={styles.tableCell}>
                          {possibleAttachmentTypes.has(attachmentType)
                            ? attachmentType
                            : "Other"}
                        </Text>
                      </View>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={{ ...styles.label, fontSize: 18 }}>J8 Data</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Fiscal Year</Text>
              <Text style={styles.value}>
                {props.request.requestField.fiscalYear}
              </Text>
              <Text style={styles.label}>Purchase Number</Text>
              <Text style={styles.value}>
                {props.request.requestField.purchaseNumber}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Quarter</Text>
              <Text style={styles.value}>
                {props.request.requestField.fiscalQuarter}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={{ ...styles.label, fontSize: 18 }}>
                Cardholder Data
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Transaction ID</Text>
              <Text style={styles.value}>
                {props.request.requestField.transactionId}
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Execution Date</Text>
              <Text style={styles.value}>
                {props.request.requestField.executionDate &&
                  format(
                    parseISO(props.request.requestField.executionDate),
                    "dd MMM yyyy"
                  )}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={{ ...styles.label, fontSize: 18 }}>
                  Signatures
                </Text>
              </View>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead,
                    width: "15%"
                  }}
                >
                  <Text style={styles.tableCell}>Step</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead,
                    width: "10%"
                  }}
                >
                  <Text style={styles.tableCell}>Action</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead,
                    width: "10%"
                  }}
                >
                  <Text style={styles.tableCell}>Date</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead,
                    width: "30%"
                  }}
                >
                  <Text style={styles.tableCell}>Signature</Text>
                </View>
                <View
                  style={{
                    ...styles.tableCol,
                    ...styles.tableCellHead,
                    width: "35%"
                  }}
                >
                  <Text style={styles.tableCell}>Comments</Text>
                </View>
              </View>
              {getActions().map(
                (action: ApprovalAction | null, index: number) => {
                  if (!badges[index]) return null;
                  return (
                    <View style={{ ...styles.tableRow }} key={`sig-${index}`}>
                      <View style={{ ...styles.tableCol, width: "15%" }}>
                        <Text style={styles.tableCell}>
                          {action && action.formInputs["status"]}
                        </Text>
                      </View>
                      <View style={{ ...styles.tableCol, width: "10%" }}>
                        <Text style={styles.tableCell}>
                          {action ? action.pastTense : "Unsigned"}
                        </Text>
                      </View>
                      <View style={{ ...styles.tableCol, width: "10%" }}>
                        <Text style={styles.tableCell}>
                          {action && action.date
                            ? format(parseISO(action.date), "dd MMM yyyy")
                            : "-"}
                        </Text>
                      </View>
                      <View style={{ ...styles.tableCol, width: "30%" }}>
                        <Text style={styles.tableCell}>
                          {action
                            ? action.formInputs["user"]
                              ? action.formInputs["user"].Title
                              : action.formInputs["userString"]
                            : "-"}
                        </Text>
                      </View>
                      <View style={{ ...styles.tableCol, width: "35%" }}>
                        <Text style={styles.tableCell}>
                          {action
                            ? action.formInputs["comments"]
                              ? action.formInputs["comments"]
                              : "-"
                            : "-"}
                        </Text>
                      </View>
                    </View>
                  );
                }
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
