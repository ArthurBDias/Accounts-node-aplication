//modulos externos
import inquirer from 'inquirer'
import chalk from 'chalk'

//modulos internos
import fs from 'fs'

operation()

function operation() {

    console.log('\r\t')
    console.log(chalk.bgCyan.bold('O que deseja fazer agora?'))

    inquirer.prompt([{
        type: 'list',
        name: 'action',
        choices: [
            'Criar conta',
            'Excluir conta',
            'Consultar saldo',
            'Depositar',
            'Sacar',
            'Tranferir',
            'Sair'
        ]
    }])
    .then((answers) =>{

        
        
        const action = answers['action']

        if(action === 'Criar conta'){
            createAccount()
        }
        else if(action === 'Excluir conta'){
            cancelAccount()
        }
        else if(action === 'Consultar saldo'){
            getAccountBalance()
        }
        else if(action === 'Depositar'){
            deposit()
        }
        else if(action === 'Sacar'){
            withdraw()
        }
        else if(action === 'Tranferir'){
            getAccountBalance()
        }
        else if(action === 'Sair'){
            console.clear()
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
            process.exit()
        }
    })
    .catch(err => console.log(err))
}

function createAccount(){
    console.log(chalk.bgGreen.black('Parabens por escolher o nosso banco!'))
    console.log(chalk.green.bold('Defina as opções da sua conta a seguir'))

    buildAccount()
}

function cancelAccount() {
    
    console.log(chalk.bgBlue('Pedimos desculpa se fizemos algo de errado!'))

    inquirer.prompt([{
        name: 'problem',
        message: 'Você teve algum problema usando o account?',
        type:  'confirm'
    }])
    .then((answers) => {
        
        if(answers.problem === true){
            inquirer.prompt([{
                name: 'cancelReason',
                message: 'Por favor diga qual foi o problema'
            }])
            .then((answers) =>{

                console.log(chalk.blue('Seu problema foi registrado e iremos tentar resolve-lo!'))
                inquirer.prompt([{
                    name: 'optionCancel',
                    message: 'Deseja continuar o cancelamento da conta?',
                    type:  'confirm'
                }])
                .then((answers) => {
            
                    if(answers.optionCancel === true){
                        deleteAccount()
                    }
                    else{
                        return operation()
                    }
                })
                .catch(err => console.log(err))
                
            })
            .catch(err => console.log(err))
        }
        else{
            
            inquirer.prompt([{
                name: 'optionCancel',
                message: 'Deseja continuar o cancelamento da conta?',
                type:  'confirm'
            }])
            .then((answers) => {
        
                if(answers.optionCancel === true){
                    deleteAccount()
                }
                else{
                    return operation()
                }
            })
            .catch(err => console.log(err))
        }
    })
    .catch(err => console.log(err))
}

function getAccountBalance() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da conta?'
    }])
    .then((answers) => {
        
        const accountName = answers['accountName']

        if(!checkAccount(accountName)){
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)
        console.log(chalk.yellow.bold(`Olá ${accountName}, o saldo na sua conta é de R$${accountData.balance}`))

        operation()
        
    })
    .catch(err => console.log(err))

}

function deposit() {

    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da sua conta'
    }])
    .then((answers) =>{
        
        const accountName = answers['accountName']

        if(!checkAccount(accountName)){
            return deposit()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Qual o valor que você deseja depositar?'
        }])
        .then((answers) => {
            const amount = answers['amount']

            //add an amount

            addAmount(accountName, amount)
            operation()

        })
        .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
}

function withdraw() {
    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual o nome da conta?'
    }])
    .then((answers) => {
        
        const accountName = answers['accountName']

        if(!checkAccount(accountName)){
            return withdraw()
        }

        inquirer.prompt([{
            name: 'amount',
            message: 'Qunato você deseja sacar?'
        }])
        .then((answers) =>{
            
            const amount = answers['amount']
            removeAmount(accountName, amount)
        })
        
    })
    .catch(err => console.log(err))
}

function buildAccount() {
    inquirer.prompt([{
        name:'accountName',
        message: 'Qual será o nomde da conta?'
    }])
    .then((answers) =>{

        const accountName = answers['accountName']

        if(!fs.existsSync('./accounts')){
            fs.mkdirSync('./accounts', (err)=>{
                console.log(err)
            })
        }

        if(checkAccount(accountName)){
            console.log(chalk.bgRed.bold("Esta conta ja exite, escolha outro nome!"))
            return buildAccount()
        }

        fs.writeFileSync(`./accounts/${accountName}.json`, '{"balance": 0}', (err) =>{
            console.log(err)
        })

        console.log(chalk.green('Parabéns, sua conta foi criada com sucesso!'))
        operation()
    })
    .catch(err => console.log(err))
}

function deleteAccount() {

    inquirer.prompt([{
        name: 'accountName',
        message: 'Qual é o nome da conta?'
    }])
    .then((answers) =>{

        const accountName = answers.accountName

        if(checkAccount(accountName)){
            
            fs.unlinkSync(`./accounts/${accountName}.json`, (err) => {
                
                if(err){
                    console.log(err)
                }
            })

            console.log(chalk.blue.bold('Conta deletada com sucesso!'))
            operation()

        }
        else{
            deleteAccount()
        }

    })
    .catch(err => console.log(err))

}

function addAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if(!amount || amount <= 0){
        console.log(chalk.bgRed.white.bold('Ocoreu um erro, tente novamente mais tarde!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(`./accounts/${accountName}.json`, JSON.stringify(accountData))
    console.log(chalk.green.bold(`O valor de R$${amount} foi depositado na sua conta!`))
}

function removeAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if(!amount){
        console.log(chalk.bgRed('Ocoreu um erro, tente novamente mais tarde!'))
        return removeAmount()
    }

    if(accountData.balance < amount){
        console.log(chalk.bgRed('Valor indisponivel!'))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(`./accounts/${accountName}.json`, JSON.stringify(accountData), (err) =>{
        console.log(err)
    })

    console.log(chalk.green.bold(`Foi realizado um saque de R$${amount} da sua conta!`))
    operation()

}

function checkAccount(accountName){

    if(!fs.existsSync(`./accounts/${accountName}.json`)){
        console.log(chalk.bgRed.bold("Esta conta não exite, escolha outro nome!"))
        return false
    }

    return true
}

function getAccount(accountName) {
    const accountJson = fs.readFileSync(`./accounts/${accountName}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJson)
}