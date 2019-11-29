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
  Button, Form, FormGroup, Input, Label, Table, Alert
} from 'reactstrap';
import './Home.css';
import HealthTracLogo from './HealthTracLogo.png';


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
    formData.append('file', files);
    formData.append('email', props.theUser.email);
    formData.append('sub', props.theUser.sub);
    console.log('formData:',formData);

    const axiosResponse = await axios({
      method: 'POST',
      url: 'http://localhost:5000/api/healthtrac/patients/upload',
      data: {
            id: props.theUser.Id,
            time: props.theUser.time,
            sub: props.theUser.sub
          }
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
      return ( <h1> Page is loading, please wait... </h1>);
      }
      else if (isDoctor) {
        return ( 
          <div>
            <p> Doctor name: {props.theUser.name} </p> 
            <p> Doctor email: {props.theUser.email} </p> 
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
                      <th>Date & Time</th>
                      <th>Heart Rate Value</th>
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
          <div class="text"> Patient name: {
            props.theUser.name
          } </div> <div class="text"> Patient email: {
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
          return ( <div><body>
            <img src={HealthTracLogo} alt="HealthTrac logo"/>
              <h1>Welcome to HealthTrac</h1>
                <p>HealthTrac is a service that allows patients to upload heart rate data from their <a href="https://www.fitbit.com/">FitBit</a>, sending information directly to their doctor, eliminating paper logs and excess doctor's visits.</p>
                <p>Doctors are able to view each of their patients' heart rate logs instantly!</p></body></div>
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