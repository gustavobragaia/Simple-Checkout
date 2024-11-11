
// getting personal consts
const namePerson = document.getElementById("name")
const phone = document.getElementById("phone")
const email = document.getElementById("email")
const cep = document.getElementById("cep")

// getting shipping consts
const endereco = document.getElementById("endereco")
const numeroCasa = document.getElementById("numerocasa")
const complemento = document.getElementById("complemento")
const bairro = document.getElementById("bairro")
const cidade = document.getElementById("cidade")
const estadoUF = document.getElementById("estadouf")

// getting card info
const cardName = document.getElementById("cardName")
const cardNumber = document.getElementById("cardNumber")
const cardMonth = document.getElementById("cardMonth")
const cardYear = document.getElementById("cardYear")
const cardCVV = document.getElementById("cardCVV")
const cardCPF = document.getElementById("cardCPF")
const cardInstallments = document.getElementById("cardInstallments")

// declaring cardExpiration (inicialized on line 43)
let cardExpiration

//elements
const btnPayment = document.getElementById("gopayment")
const sectionShipping = document.getElementById("shipping")
const sectionShippingData = document.getElementById("shippingData")
const sectionPaymentData = document.getElementById("paymentData")
const formGlobal = document.getElementById("form-container")

//popup paymentAccepted
const popupPaymentAccepted = document.getElementById("popupPaymentAccepted")
const popupNamePaymentAccepted = document.getElementById("namePaymentAccepted")
const popupNamePaymentNotAccepted = document.getElementById("namePaymentNotAccepted")
const popupPaymentNotAccepted = document.getElementById("popupPaymentNotAccepted")

//gettind cardData.amount
let paymentAmount

//inicialize the function to update text of installments
updateInstallments()

document.getElementById('paymentForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Evita o comportamento padrão de envio do formulário

    // getting card expiration on right form
    cardExpiration = `${cardMonth.value}/${cardYear.value}`

    const cardData = {
        "amount": 'z',
        "offer_hash": "afrki", // hash de uma oferta
        "payment_method": "credit_card", // credit_card, billet, pix
        "card": {
            "number": cardNumber.value,
            "holder_name": cardName.value,
            "cardExpiration": cardExpiration,
            "cvv": cardCVV.value
        },
        "customer": {
            "name": namePerson.value,
            "email": email.value,
            "phone_number": phone.value,
            "document": "03114518028",
            "street_name": endereco.value,
            "number": numeroCasa.value,
            "complement": complemento.value,
            "neighborhood": bairro.value,
            "city": cidade.value,
            "state": estadoUF.value,
            "zip_code": cep.value
        },
        "cart": [{
            "product_hash": "iajjjzflse ",
            "title": "Amostra Gratis",
            "cover": null,  
            "price": 5,
            "quantity": 1,
            "operation_type": 1,
            "tangible": false
        }],
        "installments": cardInstallments.value,
        "expire_in_days": 1,
        "postback_url": "https://enf8p6q9i44zv.x.pipedream.net/" // URL PARA RECEBER ATUALIZAÇÃO DAS TRANSAÇÕES
    };

    updateInstallments(cardData.amount);

    //disable func to show fields values
    //displayInfos()
    

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
        paymentAccepted()


    } catch (error) {
        paymentNotAccepted()
        namePerson.focus()
    }
});

// input phone on right format
function formatPhoneBR(phone) {
    // Remove qualquer caractere que não seja número
    phone = phone.replace(/\D/g, '');

    // Formata o telefone no formato (XX) XXXXX-XXXX
    if (phone.length === 11) {
        phone = phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    } else if (phone.length === 10) {
        // Caso o número seja de 10 dígitos, usa o formato (XX) XXXX-XXXX
        phone = phone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
    }
    return phone;
}

//apply the function formatPhoneBR on input
phone.onkeydown = () => {
    phone.value = formatPhoneBR(phone.value)
}

// format zip code in XXXXX-XXX
function formatCEP(value) {
    // Remove qualquer caractere que não seja número
    value = value.replace(/\D/g, '');

    // Formata o CEP no formato XXXXX-XXX se tiver 8 dígitos
    if (value.length === 8) {
        value = value.replace(/^(\d{5})(\d{3})$/, "$1-$2");
    }
    return value;
}

// zip code event to format and get autocomplete 
cep.oninput = () => {
    if (cep.value.length !== 8){
        return;
    }
    else if (cep.value.length === 8){
        sectionShippingData.style.display = "block"
    }
    //get api to autocomplete zip code 
    fetch(`https://viacep.com.br/ws/${cep.value}/json`)
        .then(resposta => resposta.json())
        .then(json => {
            bairro.value = json.bairro;
            cidade.value = json.localidade;
            estadoUF.value = json.uf;
            endereco.value = json.logradouro;

            numeroCasa.focus()

        })

    cep.value = formatCEP(cep.value)
    numeroCasa.scrollIntoView({ behavior: "smooth", block: "start" });
}

btnPayment.addEventListener("click", () => {
    btnPayment.style.display = "none"
    sectionPaymentData.style.display = "block"
    cardName.scrollIntoView({ behavior: "smooth", block: "start" });
    cardNumber.focus()

})

//update dynamic installments (with price)
function updateInstallments(amount){
    //getting real price in BRL
    price = amount/ 100
    
    //getting options from select
    cardInstallments.options[0].textContent = `1x de ${price}`
    cardInstallments.options[1].textContent = `2x de ${(price/2)*1}`
    cardInstallments.options[2].textContent = `3x de ${(price/3)*1}`
    cardInstallments.options[3].textContent = `4x de ${(price/4)*1}`
    cardInstallments.options[4].textContent = `5x de ${(price/5)*1}`
    cardInstallments.options[5].textContent = `6x de ${(price/6)*1}`

} 

// all below is oninput verifications
cardCPF.oninput = () => {
    cardCPF.value = cardCPF.value.replace(/\D/g, '');
}

cardNumber.oninput = () => {
    cardNumber.value = cardNumber.value.replace(/\D/g, '');
}

cardCVV.oninput = () => {
    cardCVV.value = cardCVV.value.replace(/\D/g, '');
}

cardName.oninput = () => {
    cardName.value = cardName.value.replace(/[^a-zA-Z\s]/g, '');
}

namePerson.oninput = () => {
    namePerson.value = namePerson.value.replace(/[^a-zA-Z\s]/g, '');
}
//end input verifications~


// show popup when payment is accepted
function paymentAccepted(){
    popupPaymentAccepted.style.display ="flex"
    popupNamePaymentAccepted.textContent = `${namePerson.value}, seu pagamento foi confirmado.`;
    formGlobal.classList.add("afterpayment");
}

function paymentNotAccepted(){
    popupPaymentNotAccepted.style.display ="flex"
    popupNamePaymentNotAccepted.textContent = `${namePerson.value}, houve um problema no pagamento. Revise os campos.`;
    formGlobal.classList.add("afterpayment");

     //remove popup after 3s
     setTimeout  (() =>{
        popupPaymentNotAccepted.style.display ="none"
        formGlobal.classList.remove("afterpayment");
    }, 2000)
}

