// Importation de password-validator
const passwordValidator  =  require ( "password-validator" ) ;

// Création du schéma
const passwordSchema = new passwordValidator();

passwordSchema 
. est ( ) . min ( 8 )                                     // Longueur minimale 8 
. est ( ) . max ( 100 )                                   // Longueur maximale 100 
. a ( ) . majuscule ( )                               // Doit contenir des lettres majuscules 
. a ( ) . minuscule ( )                               // Doit contenir des lettres minuscules 
. a ( ) . chiffres ( 2 )                                // Doit avoir au moins 2 chiffres 
. a ( ) . pas ( ) . espaces ( )                            // Ne doit pas avoir d'espaces 
. est ( ) . pas ( ) . oneOf ( [ 'Passw0rd' ,  'Password123' ] ) ;  // Liste noire ces valeurs

console.log("---->CONTENU: passwordSchema");
console.log(passwordSchema);


// module.exports = (req, res, next) => {
//     if(passwordSchema.validate(req.body.password)){
//         next();
//     } else {
//         return res.status(400).json({error: `Le mot de pass n'est pas assez fort ${passwordSchema.validate(req.body.password , { list: true })}`})
//     }
// }