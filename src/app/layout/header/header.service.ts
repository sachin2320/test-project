import { Injectable } from '@angular/core';
import { NotificationModel } from "app/models/notification.model";

@Injectable()
export class HeaderService {
    public GetNotification(): NotificationModel[] {
        // TODO: Remove Hard Coded Data
        var result: NotificationModel[] = [];
        result.push(new NotificationModel(1, "New Mail", "5 mins ago", new Date(), "Mail from Sales Team", true, "UnReaded"));
        result.push(new NotificationModel(1, "New Mail1", "6 mins ago", new Date(), "Mail from Sales Team1", true, "UnReaded"));
        result.push(new NotificationModel(1, "New Mail1", "7 mins ago", new Date(), "Mail from Sales Team1", true, "UnReaded"));
        return result;
    }
}