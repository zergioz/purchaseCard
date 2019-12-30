export const StepStatus = [
  { caseStep: "DRAFT", fwd: "DRAFT", fwdj6: "DRAFT", numerStep: 1 },
  {
    caseStep: "SUBMITTED",
    fwd: "DIR APPROVAL",
    fwdj6: "DIR APPROVAL",
    numerStep: 2
  },
  {
    caseStep: "DIRECTORATE_APPROVAL",
    fwd: "BO APPROVAL",
    fwdj6: "BO APPROVAL",
    numerStep: 3
  },
  {
    caseStep: "BILLING_OFFICIAL_APPROVAL",
    fwd: "PBO APPROVAL",
    fwdj6: "J6 APPROVAL",
    numerStep: 4
  },
  {
    caseStep: "J6_APPROVAL",
    fwd: "ERROR: SEE J69",
    fwdj6: "PBO APPROVAL",
    numerStep: 5
  },
  {
    caseStep: "PBO_APPROVAL",
    fwd: "J8 APPROVAL",
    fwdj6: "J8 APPROVAL",
    numerStep: 6
  },
  {
    caseStep: "J8_APPROVAL",
    fwd: "CARD HOLDER VALIDATION",
    fwdj6: "CARD HOLDER VALIDATION",
    numerStep: 7
  },
  {
    caseStep: "CARD_HOLDER_VALIDATION",
    fwd: "REQUESTOR VALIDATION",
    fwdj6: "REQUESTOR VALIDATION",
    numerStep: 8
  },
  {
    caseStep: "REQUESTOR_VALIDATION",
    fwd: "SUPPLY VALIDATION",
    fwdj6: "SUPPLY VALIDATION",
    numerStep: 9.3
  },
  {
    caseStep: "SUPPLY_VALIDATION",
    fwd: "PENDING PBO FINAL",
    fwdj6: "PENDING PBO FINAL",
    numerStep: 9.6
  },
  {
    caseStep: "FINAL_VALIDATION",
    fwd: "PENDING CLOSING",
    fwdj6: "PENDING CLOSING",
    numerStep: 9.9
  },
  { caseStep: "CLOSED", fwd: "CLOSED", fwdj6: "CLOSED", numerStep: 10 }
];
