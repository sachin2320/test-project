export class NotificationModel {
    public Id: number;
    //Summary of Notification
    public NotificationText: string;
    //Smaal text which will display as a muted text like time & date.
    public NotificationMutedText: string;
    //Notification Date
    public Date: Date;
    //Details Notification Text
    public Description: string;
    //Deleted or not
    public Active: boolean;
    //Whether user has read or not.
    public State: string;

    constructor(id: number, notificationText: string, notificationMutedText: string, date: Date, description: string, active: boolean, state: string) {
        this.Id = id;
        this.NotificationText = notificationText;
        this.NotificationMutedText = notificationMutedText;
        this.Date = date;
        this.Description = description;
        this.Active = active;
        this.State = state;
    }
}