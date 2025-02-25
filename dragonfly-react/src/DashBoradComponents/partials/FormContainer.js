import React from 'react'
import {Row, Container, Col} from 'react-bootstrap'

const FormContainer = ({children}) => {
    return (
        <Container>
            <Row className = 'justify-center-md-center'>
                <Col xs={12} md={6}>
                    {children}
                </Col>
            </Row>
            
        </Container>
    )
}

export default FormContainer
