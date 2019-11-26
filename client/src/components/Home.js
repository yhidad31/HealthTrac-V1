import React, {
  useEffect,
  useState
} from 'react';
import {
  useAuth0
} from '../react-auth0-spa';
import axios from 'axios';
import Dropzone from './Dropzone';
import {
  Button, Form, FormGroup, Input, Label, Table
} from 'reactstrap';

const HomeContent = (props) => {
    const [isDoctor, setDoctor] = useState();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState([]);
    const [selectedPatientInfo, setSelectedPatientInfo] = useState([]);

    const [isPatient, setPatient] = useState();
    const [files, setFiles] = useState();

    useEffect(() => {
      // axios post to express server to check whether the user is a doctor or a patient
      const initialize = async () => {
        const axiosResponse = await axios({
          method: 'POST',
          url: 'http://localhost:5000/api/healthtrac/patients',
          data: {
            name: props.theUser.name,
            email: props.theUser.email,
            sub: props.theUser.sub
          }
        });

        const user = axiosResponse.data.user;
        if (user.is_patient) setPatient(true);
        if (user.is_doctor) {
          const patients = axiosResponse.data.patients;
          console.log('user', user);
          console.log('patients', patients);
          setDoctor(true);
          setPatients(patients);
        }
      }
      initialize();
      // eslint-disable-next-line
    }, []);

    const onChangeHandler = event => {
      console.log()
      setFiles(event.target.files[0])
    }
    // const onReceiveFiles = (filesFromDropzone) => {
    //   console.log('This is dropzone',filesFromDropzone[0]);
    //   //setFiles(filesFromDropzone[0]);
    //   setFiles(filesFromDropzone);
    // }

    const onReceiveFiles = (filesFromDropzone) => {
    console.log('This is dropzone',filesFromDropzone);
    setFiles(filesFromDropzone);
  }

  const uploadCsvFile = async () => {
   console.log(files); //Undefined how to define

    // create data to be sent to express
   // the type is form data, because we want to send file instead of json
   const formData = new FormData();
  //  console.log("files:", files)
    formData.append('file', files);
  //  console.log("formData.get('file'):", formData.get('file'))
  //  console.log("props.theUser.email:", props.theUser.email)
    formData.append('email', props.theUser.email);
  //  console.log("props.theUser.sub:", props.theUser.sub)
    formData.append('sub', props.theUser.sub);
    formData.append('time', props.theUser.time);
    // console.log('formData:',formData);
    formData.append('id', props.theUser.id);
    window.formData = formData

    const axiosResponse = await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/healthtrac/patients/upload',
      data: formData
      // {
      //       id: props.theUser.Id,
      //       time: props.theUser.time,
      //       sub: props.theUser.sub,
      //       files: formData
      //     } = formDa
    });
      console.log(axiosResponse.data);
    }

    const handleSelectedPatient = e => {
      setSelectedPatient(e.target.value);
    }

    const handleSearchPatient = async (e) => {
      e.preventDefault();
      console.log('selectedPatient:', selectedPatient);

      const axiosResponse = await axios({
        method: 'POST',
        url: 'http://localhost:5000/api/healthtrac/patients/doctors',
        data: {
              selectedPatientId: selectedPatient
            }
      });
      console.log(axiosResponse.data);
      setSelectedPatientInfo(axiosResponse.data.patientInfo);
    }

    if (!isDoctor && !isPatient) {
      return ( <div> Page is loading, please wait... </div>);
      }
      else if (isDoctor) {
        return ( 
          <div>
            <div> Doctor name: {props.theUser.name} </div> 
            <div> Doctor email: {props.theUser.email} </div> 
            {/*<div>Doctor sub: {props.theUser.sub}</div>*/ } 
            <Form onSubmit={handleSearchPatient}>
              <FormGroup>
                <Label for="selectPatient">Select Patient</Label>
                <Input type="select" name="selectPatient" id="selectPatient" onChange={handleSelectedPatient}>
                  <option value=""></option>
                  {
                    patients.map( (patient, index) => (
                      <option key={index} value={patient.id}>{patient.name}</option>
                    ))
                  }
                </Input>
                <Button>Search</Button>
              </FormGroup>
            </Form>
            {
              selectedPatientInfo && selectedPatientInfo.length > 0 && 
              (
                <Table>
                  <thead>
                    <tr>
                      <th>Date Time</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      selectedPatientInfo.map( (item, index) => (
                        <tr key={index}>
                          <td>{item.time}</td>
                          <td>{item.value}</td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              )
            }
          </div>
        );
      } else if (isPatient) {
        return ( <div>
          <div> Patient name: {
            props.theUser.name
          } </div> <div> Patient email: {
            props.theUser.email
          } </div> {
            /*<div>Patient sub: {props.theUser.sub}</div>*/ } {
            /*<Dropzone onReceiveFiles={onReceiveFiles} />*/ } <
          input type = 'file'
          name = 'file'
          onChange = {
            onChangeHandler
          }
          /> <Button type = "button"
          onClick = {
            uploadCsvFile
          } > Upload </Button> </div>
        );
      }
    }

    const Home = (props) => {
        const {
          loading,
          user
        } = useAuth0();
        if (loading || !user) {
          return ( <div> Welcome to HealthTrac </div>
          );
        }
        return ( < HomeContent {
            ...props
          }
          theUser = {
            user
          }/>)
        }


        export default Home;