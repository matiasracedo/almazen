const { Order } = require('../db.js');
const server = require('express').Router();

// SDK de Mercado Pago
const mercadopago = require('mercadopago');

const { MP_TOKEN, REACT_APP_BACK } = process.env;

//Agrega credenciales
mercadopago.configure({
    access_token: MP_TOKEN
});

/* 
{"id":702497901,"nickname":"TESTUQDPMRD8","password":"qatest2741","site_status":
"active","email":"test_user_2651455@testuser.com"}

{"id":702467919,"nickname":"TETE3508699","password":"qatest8604","site_status":"
active","email":"test_user_61151956@testuser.com"} */


//Ruta que genera la URL de MercadoPago
server.get("/", async (req, res, next) => {

    const { id_orden } = req.query;

    //Traemos la orden creada
    const { products } = await Order.findOne({
        where: {
            id: id_orden
        },
        include: {
            all: true
        }
    })

    if (products.length > 0) {
        var items_ml = products.map(i => ({
            title: i.name,
            unit_price: i.orderLine.price,
            quantity: i.orderLine.quantity,
        }))
    }

    // Crea un objeto de preferencia
    let preference = {
        items: items_ml,
        external_reference: `${id_orden}`,
        payment_methods: {
            excluded_payment_types: [
                {
                    id: "atm"
                }
            ],
            installments: 3  //Cantidad máximo de cuotas
        },
        back_urls: {
            success: `${REACT_APP_BACK}/mercadopago/pagos`,
            failure: `${REACT_APP_BACK}/mercadopago/pagos`,
            pending: `${REACT_APP_BACK}/mercadopago/pagos`,
        },
    };

    mercadopago.preferences.create(preference)

        .then(function (response) {
            // console.info('respondio')
            //Este valor reemplazará el string"<%= global.id %>" en tu HTML
            global.id = response.body.id;
            // console.log(response.body)
            res.json({ id: global.id });
        })
        .catch(function (error) {
            console.log(error);
        })
})


//Ruta que recibe la información del pago
server.get("/pagos", (req, res) => {
    console.info("EN LA RUTA PAGOS ", req)
    const payment_id = req.query.payment_id
    const payment_status = req.query.status
    const external_reference = req.query.external_reference
    const merchant_order_id = req.query.merchant_order_id
    console.log("datos", payment_status)

    //Aquí edito el status de mi orden
    Order.findByPk(external_reference)
        .then((order) => {
            order.payment_id = payment_id
            order.payment_status = payment_status
            order.merchant_order_id = merchant_order_id
            if(payment_status === "pending" || payment_status === "in_process"){
                order.status="procesando"
            }
            if(payment_status === "approved"){

                order.status = "completa"
            }
            // console.log('Salvando order')
            order.save()
                .then((_) => {
                    // console.info('redirect success')

                    return res.redirect(
                      `${BACK_DOMAIN}/confirmOrder/${external_reference}`
                    );
                })
                .catch((err) => {
                    console.error('error al salvar', err)
                    return res.redirect(`${BACK_DOMAIN}/?error=${err}&where=al+salvar`)
                })
        })
        .catch(err => {
            console.error('error al buscar', err)
            return res.redirect(`${BACK_DOMAIN}/?error=${err}&where=al+buscar`)
        })

    //proceso los datos del pago 
    //redirijo de nuevo a react con mensaje de exito, falla o pendiente
})


//Busco información de una orden de pago
server.get("/pagos/:id", (req, res) => {
    const mp = new mercadopago(ACCESS_TOKEN)
    const id = req.params.id
    console.info("Buscando el id", id)
    mp.get(`/v1/payments/search`, { 'status': 'pending' }) //{"external_reference":id})
        .then(resultado => {
            console.info('resultado', resultado)
            res.json({ "resultado": resultado })
        })
        .catch(err => {
            console.error('No se consulto:', err)
            res.json({
                error: err
            })
        })
})

module.exports = server;