import dal from "./dal";
import { Request } from "./models/Request";
import { Role } from "./models/Role";
import { Observable, of } from "rxjs";
import { IEmailProperties } from "./sharepoint/SharepointConnector";

export class EmailService {
  private dal: dal;

  constructor() {
    this.dal = new dal();
  }

  notifyNextApproversFor(request: Request, roles: Role[]): Observable<any> {
    const approvers = roles.filter(role => role.caresAbout(request));
    let approverEmails = [];
    if (request.status == "Cardholder") {
      approverEmails = [request.requestField.RequestorCardHolderName];
    } else if (request.status == "Requestor") {
      approverEmails = [request.requestor.EMail ? request.requestor.EMail : ""];
    } else {
      approverEmails = approvers.map(approver => approver.email);
    }
    const email: IEmailProperties = {
      To: approverEmails,
      Subject: `New GPC Request (#${request.id})`,
      Body:
        "<h3>You've received a new GPC request</h3>" +
        "<br />" +
        `<a href="https://soceur.sof.socom.mil/app/gpc/#/requests/details/${request.id}">GPC Request #${request.id}</a>` +
        "<br />" +
        `You are receiving this notification because you can approve this GPC request at the <b>${request.status.toUpperCase()}</b> step.` +
        "<br />" +
        "<br />" +
        "<h4>Request summary:</h4>" +
        "<br />" +
        "<br />" +
        `Submitter: ${request.author.FirstName} ${request.author.LastName}` +
        "<br />" +
        `Cardholder: ${request.requestField.RequestorCardHolderName}` +
        "<br />" +
        `Directorate: ${request.requestField.RequestorDirectorate}` +
        "<br />" +
        `Justification:` +
        `<blockquote>${request.requestField.RequestJustification}</blockquote>` +
        "<br />" +
        `Waiting on: ${request.status}` +
        "<br />" +
        `URL: https://soceur.sof.socom.mil/app/gpc/#/requests/details/${request.id}` +
        "<br />" +
        "Please action this request as quickly as possible by clicking on the link below, or by pasting the URL above into your browser." +
        "<br />" +
        "<br />" +
        `<a href="https://soceur.sof.socom.mil/app/gpc/#/requests/details/${request.id}">Go to GPC Request #${request.id}</a>` +
        "<br />" +
        "<br />" +
        "If you have received this message in error, please contact soceurlistj69@socom.mil to unsubscribe"
    };
    return this.dal.sendEmail(email);
  }

  notifySubmitterFor(request: Request): Observable<any> {
    let submitterEmail = [request.author.EMail ? request.author.EMail : ""];
    const email: IEmailProperties = {
      To: submitterEmail,
      Subject: `GPC Request (#${request.id}) updated`,
      Body:
        "<h3>Your GPC request has been updated</h3>" +
        "<br />" +
        `<a href="https://soceur.sof.socom.mil/app/gpc/#/requests/details/${request.id}">GPC Request #${request.id}</a>` +
        "<br />" +
        `You are receiving this notification because your GPC request has been moved to the <b>${request.status.toUpperCase()}</b> step.` +
        "<br />" +
        "<br />" +
        "<h4>Request summary:</h4>" +
        "<br />" +
        "<br />" +
        `Submitter: ${request.author.FirstName} ${request.author.LastName}` +
        "<br />" +
        `Cardholder: ${request.requestField.RequestorCardHolderName}` +
        "<br />" +
        `Directorate: ${request.requestField.RequestorDirectorate}` +
        "<br />" +
        `Justification:` +
        `<blockquote>${request.requestField.RequestJustification}</blockquote>` +
        "<br />" +
        `Status: ${request.status}` +
        "<br />" +
        `URL: https://soceur.sof.socom.mil/app/gpc/#/requests/details/${request.id}` +
        "<br />" +
        "You can view your request by clicking on the link below, or by pasting the URL above into your browser." +
        "<br />" +
        "<br />" +
        `<a href="https://soceur.sof.socom.mil/app/gpc/#/requests/details/${request.id}">Go to GPC Request #${request.id}</a>` +
        "<br />" +
        "<br />" +
        "If you have received this message in error, please contact soceurlistj69@socom.mil to unsubscribe"
    };
    return this.dal.sendEmail(email);
  }
}
