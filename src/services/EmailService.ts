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

  tail = (request: Request): string =>
    "<h3>Request summary:</h3>" +
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
    `URL: ${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${request.id}` +
    "<br />" +
    "<br />" +
    "Please action this request as quickly as possible by clicking on the link below, or by pasting the URL above into your browser." +
    "<br />" +
    "<br />" +
    `<a href="${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${request.id}">Go to GPC Request #${request.id}</a>` +
    "<br />" +
    "<br />" +
    "If you have received this message in error, please contact soceurlistj69@socom.mil to unsubscribe";

  notifyRequestor(request: Request): Observable<any> {
    let approverEmails = [
      request.requestor.EMail ? request.requestor.EMail : ""
    ];
    const email: IEmailProperties = {
      To: approverEmails,
      Subject: `GPC Request (#${request.id})`,
      Body:
        "<h2>Verify that your goods have been received</h2>" +
        `<a href="${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${request.id}">GPC Request #${request.id}</a>` +
        "<br />" +
        `Your cardholder has purchased the items.  Please sign to verify that the items have been received.` +
        "<br />" +
        "<br />" +
        this.tail(request)
    };
    return this.dal.sendEmail(email);
  }

  notifyCardholder(request: Request): Observable<any> {
    let approverEmails = [request.requestField.RequestorCardHolderName];
    const email: IEmailProperties = {
      To: approverEmails,
      Subject: `New GPC Request (#${request.id})`,
      Body:
        "<h2>You've received a new GPC request</h2>" +
        `<a href="${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${request.id}">GPC Request #${request.id}</a>` +
        "<br />" +
        `You are receiving this notification so that you can execute this GPC request.` +
        "<br />" +
        "<br />" +
        this.tail(request)
    };
    return this.dal.sendEmail(email);
  }

  notifyNextApproversFor(request: Request, roles: Role[]): Observable<any> {
    const approvers = roles.filter(role => role.caresAbout(request));
    let approverEmails = [];
    if (request.status == "Cardholder") {
      return this.notifyCardholder(request);
    } else if (request.status == "Requestor") {
      return this.notifyRequestor(request);
    } else {
      approverEmails = approvers.map(approver => approver.email);
    }
    const email: IEmailProperties = {
      To: approverEmails,
      Subject: `New GPC Request (#${request.id})`,
      Body:
        "<h2>You've received a new GPC request</h2>" +
        `<a href="${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${request.id}">GPC Request #${request.id}</a>` +
        "<br />" +
        `You are receiving this notification because you can approve this GPC request at the <b>${request.status.toUpperCase()}</b> step.` +
        "<br />" +
        "<br />" +
        this.tail(request)
    };
    return this.dal.sendEmail(email);
  }

  notifySubmitterFor(request: Request): Observable<any> {
    let submitterEmail = [request.author.EMail ? request.author.EMail : ""];
    const email: IEmailProperties = {
      To: submitterEmail,
      Subject: `GPC Request (#${request.id}) updated`,
      Body:
        "<h2>Your GPC request has been updated</h2>" +
        `<a href="${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${request.id}">GPC Request #${request.id}</a>` +
        "<br />" +
        `You are receiving this notification because your GPC request has been moved to the <b>${request.status.toUpperCase()}</b> step.` +
        "<br />" +
        "<br />" +
        this.tail(request)
    };
    return this.dal.sendEmail(email);
  }
}
