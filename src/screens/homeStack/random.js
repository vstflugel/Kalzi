fetch(`https://api.razorpay.com/v1/orders`, {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${base64.encode('rzp_live_RGmSMq7cIoDFDR:90cuaJxnCzdao4dN4uhKuHSF')}`

      }),
      body: JSON.stringify({
        amount: 100,
        currency: 'INR',
        payment: {
          capture: "automatic",
          capture_options: {
            refund_speed: "normal"
          }
        },
        transfers: [
          {
            account: 'acc_HBw3DfPDNahd5z',
            amount: 100,
            currency: 'INR',
          },
        ]
      })
    })
      .then((res) => {
        return res.json()
      })
      .then((payment) => {

        // this.setState({ loading: false })

        // console.log("PAYMENT", payment)

        var options = {
          description: 'Kalzi Membership',
          image: 'https://i.imgur.com/4u1aCXb.jpg',
          currency: 'INR',
          key: 'rzp_live_RGmSMq7cIoDFDR', // Your api key
          amount: 100,
          name: 'TITLE',
          order_id: payment.id,
          theme: { color: 'blue' },
        }

        RazorpayCheckout.open(options)
            .then((payment) => {
                console.log("PAYMENT", payment)
            })
            .catch((err) => {
                console.log("CAUGHT PAYMENT")
            })
    })