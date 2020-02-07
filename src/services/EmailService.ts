import dal from "./dal";
import { Request } from "./models/Request";
import { Role } from "./models/Role";
import { Observable } from "rxjs";
import { IEmailProperties } from "./sharepoint/SharepointConnector";
import { getStatusesByFriendlyName } from "../constants/StepStatus";

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
    `Status: ${request.status}` +
    "<br />" +
    `URL: ${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${request.id}` +
    "<br />" +
    "<br />" +
    "You can view your request by clicking on the link below, or by pasting the URL into your browser." +
    "<br />" +
    "<br />" +
    `<a href="${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${request.id}">Go to GPC Request #${request.id}</a>` +
    "<br />" +
    "<br />" +
    "If you have received this message in error, please contact soceurlistj69@socom.mil to unsubscribe.";

  //this gets sent to j8 no matter what the cardholder does
  notifyFinance(request: Request, roles: Role[]): Observable<any> {
    const financeRoleNames = new Set(
      getStatusesByFriendlyName()["Finance"].approverRoles
    );
    let financeUsers = roles.filter(
      role => role.active && financeRoleNames.has(role.role)
    );
    const email: IEmailProperties = {
      To: financeUsers.map(user => user.email),
      BCC: ["ryan.a.mclean.ctr@socom.mil"],
      Subject: `GPC Request (#${request.id})`,
      Body:
        "<h2>The cardholder has actioned this GPC request.</h2>" +
        `<a href="${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${request.id}">GPC Request #${request.id}</a>` +
        "<br />" +
        `You are receiving this notification because a cardholder has actioned this GPC request.` +
        "<br />" +
        "<br />" +
        this.tail(request)
    };
    console.log(`notifyFinance(): `, email.To);
    return this.dal.sendEmail(email);
  }

  notifyRequestor(request: Request): Observable<any> {
    let approverEmails = [
      request.requestor.EMail ? request.requestor.EMail : ""
    ];
    const email: IEmailProperties = {
      To: approverEmails,
      BCC: ["ryan.a.mclean.ctr@socom.mil"],
      Subject: `GPC Request (#${request.id})`,
      Body:
        "<h2>Verify that your goods have been received</h2>" +
        `<a href="${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${request.id}">GPC Request #${request.id}</a>` +
        "<br />" +
        `You are receiving this notification because you can approve this GPC request at the <b>${request.status.toUpperCase()}</b> step.` +
        `Sign this request <u>after you have received</u> the the item(s) purchased.` +
        "<br />" +
        "<br />" +
        this.tail(request)
    };
    console.log(`notifyRequestor(): `, email.To);
    return this.dal.sendEmail(email);
  }

  notifyCardholder(request: Request): Observable<any> {
    let approverEmails = [request.requestField.RequestorCardHolderName];
    const email: IEmailProperties = {
      To: approverEmails,
      BCC: ["ryan.a.mclean.ctr@socom.mil"],
      Subject: `New GPC Request (#${request.id})`,
      Body:
        "<h2>You've received a new GPC request</h2>" +
        `<a href="${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${request.id}">GPC Request #${request.id}</a>` +
        "<br />" +
        `You are receiving this notification because you can approve this GPC request at the <b>${request.status.toUpperCase()}</b> step.` +
        `Sign this request <u>as soon as you have completed</u> the purchase.` +
        "<br />" +
        "<br />" +
        this.tail(request)
    };
    console.log(`notifyCardholder(): `, email.To);
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
      BCC: ["ryan.a.mclean.ctr@socom.mil"],
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
    console.log(`notifyNextApproversFor(): `, email.To);
    return this.dal.sendEmail(email);
  }

  notifySubmitterFor(request: Request): Observable<any> {
    let submitterEmail = [request.author.EMail ? request.author.EMail : ""];
    const email: IEmailProperties = {
      To: submitterEmail,
      BCC: ["ryan.a.mclean.ctr@socom.mil"],
      Subject: `GPC Request (#${request.id}) updated`,
      Body:
        "<h2>Your GPC request has been updated</h2>" +
        `<a href="${window.location.protocol}//${window.location.host}/app/gpc/#/requests/details/${request.id}">GPC Request #${request.id}</a>` +
        "<br />" +
        `You are receiving this notification because your GPC request has been moved to the ` +
        `<b>${request.status.toUpperCase()}</b> step.` +
        "<br />" +
        "<br />" +
        this.tail(request)
    };
    console.log(`notifySumbitterFor(): `, email.To);
    return this.dal.sendEmail(email);
  }
}
