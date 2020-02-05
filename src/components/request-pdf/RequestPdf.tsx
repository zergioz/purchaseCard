import React, { useContext } from "react";
import { Page, View, Document, StyleSheet, Text } from "@react-pdf/renderer";
import { Request } from "../../services/models/Request";
import { Role } from "../../services/models/Role";
import RoleContext from "../../contexts/RoleContext";

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
    padding: 15,
    justifyContent: "center",
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
  }
});

interface IProps {
  request: Request;
}

export const RequestPdf = (props: IProps) => {
  const { roles } = useContext(RoleContext);
  const cardholders = roles
    .filter(role => role.role === "CARD HOLDER" && role.active)
    .sort((a: Role, b: Role) => {
      if (a.directorate < b.directorate) {
        return -1;
      }
      if (a.directorate > b.directorate) {
        return 1;
      }
      return 0;
    });
  return (
    <Document>
      <Page size="A4">
        <View style={styles.section}>
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
              <Text style={styles.value}>{props.request.created}</Text>
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
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={styles.label}>Line</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Qty</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Cost</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>DD-250</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>DA-2062</Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Total</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
