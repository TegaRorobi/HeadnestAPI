const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

class PaystackService {
  constructor() {
    this.paystack = paystack;
  }

  async initializePayment(data) {
    try {
      const response = await this.paystack.transaction.initialize({
        email: data.email,
        amount: data.amount,
        reference: data.reference,
        callback_url: data.callback_url,
        metadata: data.metadata || {}
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }


  async verifyPayment(reference) {
    try {
      const response = await this.paystack.transaction.verify(reference);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }


  async getBanks() {
    try {
      const response = await this.paystack.misc.list_banks();
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

 
  generateReference(userId) {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `HEADNEST_${userId}_${timestamp}_${random}`;
  }


  nairaToKobo(nairaAmount) {
    return Math.round(nairaAmount * 100);
  }


  koboToNaira(koboAmount) {
    return koboAmount / 100;
  }

  getPaymentMethods() {
    return [
      {
        id: 'card',
        name: 'Debit/Credit Card',
        description: 'Pay with your Visa, Mastercard, or Verve card',
        icon: '💳'
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Transfer from your bank account',
        icon: '🏦'
      },
      {
        id: 'ussd',
        name: 'USSD',
        description: 'Pay using USSD code (*737#)',
        icon: '📱'
      },
      {
        id: 'qr',
        name: 'QR Code',
        description: 'Scan QR code to pay',
        icon: '📱'
      }
    ];
  }
}

module.exports = new PaystackService();