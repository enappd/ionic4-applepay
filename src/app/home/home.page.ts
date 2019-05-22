import { Component } from '@angular/core';
import { ApplePay } from '@ionic-native/apple-pay/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items: any = [
    {
      label: '3 x Basket Items',
      amount: 49.99
    },
    {
      label: 'Next Day Delivery',
      amount: 3.99
    },
    {
      label: 'My Fashion Company',
      amount: 53.98
    }
  ];
  shippingMethods: any = [
    {
      identifier: 'NextDay',
      label: 'NextDay',
      detail: 'Arrives tomorrow by 5pm.',
      amount: 3.99
    },
    {
      identifier: 'Standard',
      label: 'Standard',
      detail: 'Arrive by Friday.',
      amount: 4.99
    },
    {
      identifier: 'SaturdayDelivery',
      label: 'Saturday',
      detail: 'Arrive by 5pm this Saturday.',
      amount: 6.99
    }
  ];
  supportedNetworks: any = ['visa', 'amex'];
  merchantCapabilities: any = ['3ds', 'debit', 'credit'];
  merchantIdentifier: string = 'merchant.apple.test';
  currencyCode: string = 'GBP';
  countryCode: string = 'GB';
  billingAddressRequirement: any = ['name', 'email', 'phone'];
  shippingAddressRequirement: any = 'none';
  shippingType: string = "shipping"
  constructor(private applePay: ApplePay, public alertController: AlertController) { }

  async checkApplePayValid() {
    await this.applePay.canMakePayments().then((message) => {
      console.log(message);
      this.presentAlert(message);
      // Apple Pay is enabled. Expect:
      // 'This device can make payments.'
    }).catch((error) => {
      console.log(error);
      this.presentAlert(error)
      // There is an issue, examine the message to see the details, will be:
      // 'This device cannot make payments.''
      // 'This device can make payments but has no supported cards'
    });
  }

  async payWithApplePay() {
    try {
      let order: any = {
        items: this.items,
        shippingMethods: this.shippingMethods,
        merchantIdentifier: this.merchantIdentifier,
        currencyCode: this.currencyCode,
        countryCode: this.countryCode,
        billingAddressRequirement: this.billingAddressRequirement,
        shippingAddressRequirement: this.shippingAddressRequirement,
        shippingType: this.shippingType,
        merchantCapabilities: this.merchantCapabilities,
        supportedNetworks: this.supportedNetworks
      }
      this.applePay.makePaymentRequest(order).then(message => {
        console.log(message);
        this.applePay.completeLastTransaction('success');
      }).catch((error) => {
        console.log(error);
        this.applePay.completeLastTransaction('failure');
        this.presentAlert(error);
      });

      // In real payment, this step should be replaced by an actual payment call to payment provider
      // Here is an example implementation:

      // MyPaymentProvider.authorizeApplePayToken(token.paymentData)
      //    .then((captureStatus) => {
      //        // Displays the 'done' green tick and closes the sheet.
      //        ApplePay.completeLastTransaction('success');
      //    })
      //    .catch((err) => {
      //        // Displays the 'failed' red cross.
      //        ApplePay.completeLastTransaction('failure');
      //    });

    } catch {
      // handle payment request error
      // Can also handle stop complete transaction but these should normally not occur
    }
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Ionic 4 Apple Pay',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
