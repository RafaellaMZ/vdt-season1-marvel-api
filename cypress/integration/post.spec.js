

describe('POST /characters', function(){

    before(function(){ 
        cy.back2ThePast()
        cy.setToken() 


    })

    it('deve cadastrar um personagem', function(){
        
        const character ={ 
            name: 'Wanda Maximoff',
            alias: 'Feiticeira Escarlate',
            team: ['Vingadores', 'Anti heróis'],
            active: true
        }

        cy.postCharacter(character) 
        .then(function(response){
            expect(response.status).to.eql(201)
            cy.log(response.body.character_id)
            expect(response.body.character_id.length).to.eql(24)
        })

    });

    context('quando o personagem já existe', function(){

        const character = {
                name: 'Bruce Benner',
                alias: 'Hulk',
                team: ['Vingadores'],
                active: true
        }


        before(function(){
        cy.postCharacter(character).then(function(response){
                expect(response.status).to.eql(201)
            })
        })

        it('não deve cadastrar duplicado', function(){

            cy.postCharacter(character).then(function(response){
                expect(response.status).to.eql(400)
                expect(response.body.error).to.eql('Duplicate character')
            })
        })
    })

    context('validação de campos obrigatórios', function(){

        it('validação do campo obrigatório nome', function(){

            const character = {
                name: '',
                alias: 'Hulk',
                team: ['Vingadores'],
                active: true
            }

            cy.postCharacter(character).then(function(response){
                expect(response.status).to.eql(400)
                expect(response.body.validation.body.message).to.eql('\"name\" is not allowed to be empty')
            }) 
        })

        it('validação do campo obrigatório alias', function(){

            const character = {
                name: 'Tony Stark',
                alias: '',
                team: ['Vingadores'],
                active: true
            }

            cy.postCharacter(character).then(function(response){
                expect(response.status).to.eql(400)
                expect(response.body.validation.body.message).to.eql('\"alias\" is not allowed to be empty')
            })

        })

        it('validação do campo obrigatório team', function(){

            const character = {
                name: 'Tony Stark',
                alias: 'Homem de Ferro',
                team: [''],
                active: true
            }

            cy.postCharacter(character).then(function(response){
                expect(response.status).to.eql(400)
                expect(response.body.validation.body.message).to.eql('\"team[0]\" is not allowed to be empty')
            })
        })

        it('validação do campo obrigatório active', function(){

            const character = {
                "name": "Tony Stark",
                "alias": "Homem de Ferro",
                "team": ["Vingadores"]
                
            }

            cy.postCharacter(character).then(function(response){
                expect(response.status).to.eql(400)
                expect(response.body.validation.body.message).to.eql('\"active\" is required')
            })
        })
    })

})