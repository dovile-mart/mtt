import { Typography } from '@mui/material';
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Avatar from '@mui/material/Avatar';
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteEvent } from '../services/EventService';
import Swal from 'sweetalert2';

function MyEvents() {
    const [events, setEvents] = useState([]);


  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    fetch("http://localhost:8080/events")
      .then((response) => response.json())
      .then((data) => {
        setEvents(data);
      });
    };

    const handleDeleteEvent = async (eventId) => {
        try {
          // Show a confirmation dialog using sweetalert2
          const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this event!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#FF6969',
            cancelButtonColor: '#427D9D',
          });
    
          // If the user clicks the "Delete" button in the confirmation dialog
          if (result.isConfirmed) {
            await deleteEvent(eventId);
            fetchEvents();
            Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
          }
        } catch (error) {
          console.error(`Couldn't delete event id:${eventId}`);
        }
      };
    
    return (
        <>
            <Typography>My events page, now rendering all events from db</Typography>
            <Box sx={{ marginBottom: 5 }}>

                <Box sx={{ display: 'flex', justifyContent: 'center', padding: 10 }}>
                    <Button          
                        component={Link} to='/addevent'
                        variant='contained'
                        sx={{ marginRight: 3 }}
                    >Create new event</Button>
                </Box>
            
                <Grid container rowSpacing={5} columnSpacing={5} style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
                    {events.map((event, index) => {
                        return (
                            <Grid item key={index}>
                                <Card sx={{ width: 400, boxShadow: 5,  bgcolor:'secondary.light'}} >            
                                    <CardContent sx={{ display: 'flex', justifyContent: 'center', bgcolor:'secondary.main' }} title={event.startDate}>
                                        <Avatar
                                            sx={{ width: 100, height: 100, bgcolor:'secondary.light', color:'secondary.contrastText', fontSize:48 }}
                                            alt={event.category.categoryName[0]}
                                            src={event.category.categoryName[0]}
                                        />
                                    </CardContent>
                                    <Divider variant="fullWidth"></Divider>
                                    <CardHeader
                                        title={event.eventName}    
                                    />
                                    <CardContent>                                
                                        <Typography><b>Starts:</b> {event.startDate} <b>Ends:</b> {event.endDate}</Typography>
                                        <Typography><b>Description:</b> {event.description}</Typography>
                                        <Typography><b>Price</b>: {event.price} €</Typography>
                                        <Typography><b>Location:</b> {event.streetAddress}, {event.location.city} {event.location.zipcode}</Typography>
                                        <Typography><b>Category:</b> {event.category.categoryName}</Typography>
                                    </CardContent>  
                                    <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <IconButton component={Link} to={'/editevent/' + event.eventId } sx={{mr:5, border:2, borderColor : "secondary.main"}}><EditIcon /></IconButton>
                                        <IconButton onClick={() => handleDeleteEvent(event.eventId)} sx={{ border:2, borderColor : "secondary.main", color: "components.danger"}}><DeleteIcon/></IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })
                    }
                </Grid>
            </Box>
        </>
    )
}

export default MyEvents;