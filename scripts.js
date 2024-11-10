// getting personal consts
const namePerson = document.getElementById("name").value
const phone = document.getElementById("phone").value
const email = document.getElementById("email").value
const cep = document.getElementById("cep").value

// getting shipping consts
const endereco = document.getElementById("endereco").value
const numeroCasa = document.getElementById("numerocasa").value
const complemento = document.getElementById("complemento").value
const bairro = document.getElementById("bairro").value
const cidade = document.getElementById("cidade").value
const estadoUF = document.getElementById("estadouf").value

// getting card info
const cardName = document.getElementById("cardName").value
const cardNumber = document.getElementById("cardNumber").value
const cardMonth = document.getElementById("cardMonth").value
const cardYear = document.getElementById("cardYear").value
const cardCVV = document.getElementById("cardCVV").value
const cardCPF = document.getElementById("cardCPF").value
const cardInstallments = document.getElementById("cardInstallments").value

// getting card expiration on right form
const cardExpiration = `${cardMonth}/${cardYear}`

document.getElementById('paymentForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o comportamento padrão de envio do formulário

    const cardData = {
        "amount": 500,
        "offer_hash": "xx6ax", // hash de uma oferta
        "payment_method": "credit_card", // credit_card, billet, pix
        "card": {
            "number": cardNumber,
            "holder_name": cardName,
            "cardExpiration": cardExpiration,
            "cvv": cardCVV
        },
        "customer": {
            "name": namePerson,
            "email": email,
            "phone_number": phone,
            "document": "03114518028",
            "street_name": endereco,
            "number": numeroCasa,
            "complement": complemento,
            "neighborhood": bairro,
            "city": cidade,
            "state": estadoUF,
            "zip_code": cep
        },
        "cart": [{
            "product_hash": "e71qwkv9mq",
            "title": "Teste p API",
            "cover": null,
            "price": 5,
            "quantity": 1,
            "operation_type": 1,
            "tangible": false
        }],
        "installments": cardInstallments,
        "expire_in_days": 1,
        "postback_url": "https://enf8p6q9i44zv.x.pipedream.net/" // URL PARA RECEBER ATUALIZAÇÃO DAS TRANSAÇÕES
    };
    
    try {
        const response = await fetch('https://api.mundpay.com/api/public/v1/transactions?api_token=wqF7jcKzSK23Lq6M9s0cf4oUnMY7GsNeCgxuQZB1KAAHqMPsQgOGBkAQCGUj', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cardData)
        });

        const result = await response.json();
        document.getElementById('message').textContent = result.message;

    } catch (error) {
        document.getElementById('message').textContent = 'Erro ao processar o pagamento.';
    }
});