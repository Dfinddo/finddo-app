//
//  NotificationViewController.swift
//  OneSignalNotificationServiceExtension
//
//  Created by MAC_Finddo_01 on 27/01/21.
//  Copyright © 2021 Finddotec. All rights reserved.
//

import UIKit
import UserNotifications
import UserNotificationsUI

class NotificationViewController: UIViewController, UNNotificationContentExtension {

    @IBOutlet var label: UILabel?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any required interface initialization here.
    }
    
    func didReceive(_ notification: UNNotification) {
        self.label?.text = notification.request.content.body
    }

}
