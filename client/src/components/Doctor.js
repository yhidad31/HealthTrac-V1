import React, { useState } from 'react';
import {
  Card, CardBody, CardTitle,
  Row, Col,
  Form, FormGroup, Label, Input,
  Button
} from 'reactstrap';

const Doctor = () => {
  //selectVal-placeholder when user selects something; stores value user selected
  const [selectValue, setSelectValue] = useState();

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('search button', selectValue);

  }

  const onChange = (e) => {
    console.log('change value:', e.target.value)
    setSelectValue(e.target.value);
    //every time user changes input select, we get value and sets it to selectvalue variable
  }

  return (
    <Row>
      <Col className="mt-5 mb-5" sm={{ size: 10, offset: 1 }}>
        <Card>
          <CardBody>
            <CardTitle>Search Events</CardTitle>
            <Form onSubmit={onSubmit}>
              <FormGroup row>
                <Label sm={2} for="patient">Patient</Label>
                <Col sm={8}>
                  <Input type="select" name="patient" id="patient" value={selectValue}
                    onChange={onChange}>
                    <option></option>
                    <option>1</option>
                    <option>2</option>
                    </Input>
                </Col>
                <Col sm={2}>
                  <Button color="primary">Search</Button>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
export default Doctor;