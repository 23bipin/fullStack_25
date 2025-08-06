const mongoose = require ('mongoose')

mongoose.set('strictQuery', false)

    const personSchema = new mongoose.Schema({
        name: {
            type: String,
            minLength: 3,
            required: true
        },
        number: {
            type: String,
            minLength: 8,
            required: true,
            validate: {
                validator: function (v) {
                    const formatOK = /^\d{2,3}-\d+$/.test(v);
                    const digitsOnly = v.replace('-', '');
                    const digitCountOK = digitsOnly.length >= 8;

                    return formatOK && digitCountOK;
                },
                message: props => `${props.value} is not a valid phone number! Format must be xx-xxxxxx..., xxx-xxxxx..`
            }
        }
    })

    personSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id= returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    })

    module.exports = mongoose.model('Person', personSchema)