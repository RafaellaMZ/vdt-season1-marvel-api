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

    context('Validação dos campos obrigatórios', function(){

        const massaTestes = [
            {
                payload: {
                    name: '',
                    alias: 'Hulk',
                    team: ['Vingadores'],
                    active: true
                },
                expect_message: '\"name\" is not allowed to be empty'            
            },
            {
                payload: {                    
                        name: 'Tony Stark',
                        alias: '',
                        team: ['Vingadores'],
                        active: true                    
                },
                expect_message: '\"alias\" is not allowed to be empty'
            },
            {
                payload: {
                    name: 'Tony Stark',
                    alias: 'Homem de Ferro',
                    team: [''],
                    active: true
                },
                expect_message: '\"team[0]\" is not allowed to be empty'
            },
            {
                payload: {
                    "name": "Tony Stark",
                    "alias": "Homem de Ferro",
                    "team": ["Vingadores"]
                    
                },
                expect_message: '\"active\" is required'
            },
        ]

        massaTestes.forEach((data) => {
            it('validando cada campo obrigatório', function(){
                cy.postCharacter(data.payload)
                .then(function(response){
                    expect(response.status).to.eql(400)
                    expect(response.body.validation.body.message).to.eql(data.expect_message)
                })
            })
        })
    })

})