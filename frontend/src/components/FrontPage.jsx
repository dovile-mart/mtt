import React,{ useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Typography, TextField, Button } from "@mui/material";
import Weather from "./Weather";
import Box from "@mui/material/Box";
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { getEvents } from "../services/EventService";
function FrontPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);


  useEffect(() => {
    fetchDBevents();
    fetchHelsinkiEventDataFromApi();
    fetchEspooEventDataFromApi();
  }, []);

  //tapahtumahaku tietokannasta:
  const fetchDBevents = async () => {
    try {
      const response = await getEvents();
          const dbEvents = response.map((event) => ({
            eventId: event.eventId,
            eventName: event.eventName,
            startDate: formatDateTime(event.startDate),
            endDate: event.endDate ? formatDateTime(event.endDate) : " ",
            price: event.price + " €",
            description: event.description,
            location: event.location,
            streetAddress: event.streetAddress,
            category: event.category,
          }))
          console.log('Events from H2: ', dbEvents);
          setEvents([...dbEvents]);
          setFilteredEvents([...dbEvents]); // Aseta suodatetut tapahtumat alkuperäisiksi
    } catch (error) {
      console.log(error)
        }
      };


  //api-rajapinnasta tulleen aikamuodon formattointi:
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleDateString('fi-FI', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  };

  const fetchLocationData = (placeId) => {
    return fetch(`${placeId}`)
      .then((placeResponse) => placeResponse.json())
      .then((placeData) => {
        //location tiedot:
        const locationCity = placeData.address_locality.fi;
        const locationAddress = placeData.street_address.fi;
        const locationZipCode = placeData.postal_code;
        //console.log(locationAddress + ", " + locationZipCode + ", " + locationCity);
        return {
          city: locationCity,
          address: locationAddress,
          zipCode: locationZipCode,
        };
      });
  }
  
  const fetchEventCategory = (categoryId) => {
    return fetch(`${categoryId}`)
      .then((categoryResponse) => categoryResponse.json())
      .then((categoryData) => {
        const categoryName = categoryData.name.fi;
        return categoryName;
      });
  };

  //tapahtumahaku avoimesta rajapinnasta:
  const fetchHelsinkiEventDataFromApi = () => {
    fetch("https://api.hel.fi/linkedevents/v1/event/?start=now&end=today")
      .then((response) => response.json())
      .then((apiData) => {
        console.log('Helsinki apiData: ', apiData);
        const apiHelsinkiEvents = apiData?.data
          .filter(eventData => eventData.name.fi)
          .map((eventData) => {
            const formattedStartDate = formatDateTime(eventData.start_time);
            const formattedEndDate = eventData.end_time ? formatDateTime(eventData.end_time):'nonono';

            // Tarkista, onko tapahtuma ilmainen
            const isFree = eventData.offers && eventData.offers.length > 0 && eventData.offers[0].is_free;
            // Aseta hinta sen mukaan, onko ilmainen vai ei
            const eventPrice = isFree ? "Vapaa pääsy" :
              (eventData.offers && eventData.offers.length > 0 &&
                eventData.offers[0].price && eventData.offers[0].price.fi)
                ? eventData.offers[0].price.fi
                : 'Ei tietoa';
          
            //tapahtuman kuvaus, lyhyt ja pitkä:
            const descriptionShort = eventData.short_description.fi;
            //const descriptionLong = eventData.description.fi;
            //console.log(descriptionLong);

            //jokaisen tapahtuman location-linkin haku:
            const placeId = eventData.location ? eventData.location['@id'] || '' : '';
            //jokaisen tapahtuman kategoria-linkin haku:
            const categoryId = eventData.keywords[0] ? eventData.keywords[0]['@id'] || '' : '';
            
            return fetchLocationData(placeId)
              .then((placeData) => {
                return fetchEventCategory(categoryId)
                  .then((categoryName) => {
                    return {
                      eventId: eventData.id,
                      eventName: eventData.name.fi,
                      startDate: formattedStartDate,
                      endDate: formattedEndDate,
                      price: eventPrice,
                      description: descriptionShort,
                      location: placeData.city,
                      streetAddress: placeData.address,
                      category: categoryName,
                    };
                  });
              });
          });
        
        return Promise.all(apiHelsinkiEvents)
          .then((events) => {
            setEvents((prevEvents) => [...prevEvents, ...events]);
            setFilteredEvents((prevEvents) => [...prevEvents, ...events]);
          })
          .catch((error) => {
            console.error('Could not fetch data: ', error);
          });
      })
      .catch((error) => {
        console.error('Could not fetch data: ', error);
      });
  };

    const fetchEspooEventDataFromApi = () => {
      fetch("http://api.espoo.fi/events/v1/event/?include=location%2Ckeywords&page=2")
        .then((response) => response.json())
        .then((apiData) => {
          console.log("Espoo apiData: ", apiData);
          if (apiData.data && apiData.data.length > 0) {
            const apiEspooEvents = apiData.data.map((eventData) => {
              const formattedStartDate = formatDateTime(eventData.start_time);
              const formattedEndDate = formatDateTime(eventData.end_time);

              // Tarkista, onko tapahtuma ilmainen
              const isFree = eventData.offers && eventData.offers.length > 0 && eventData.offers[0].is_free;
              // Aseta hinta sen mukaan, onko ilmainen vai ei
              const eventPrice = isFree ? "Vapaa pääsy" :
                (eventData.offers && eventData.offers.length > 0 &&
                  eventData.offers[0].price && eventData.offers[0].price.fi)
                  ? eventData.offers[0].price.fi
                  : 'Ei tietoa';

              return {
                eventId: eventData.id,
                eventName: eventData.name.fi,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                price: eventPrice,
                description: eventData.short_description.fi, //short_description vai molemmat?
                location: eventData.location.divisions[0].name.fi,
                streetAddress: eventData.location.street_address.fi,
                category: eventData.keywords[0].name.fi && eventData.keywords[1].name.fi
              }
            })
            //console.log('Events from EspooAPI: ', apiEspooEvents);
            setEvents((prevEvents) => [...prevEvents, ...apiEspooEvents])
            setFilteredEvents((prevEvents) => [...prevEvents, ...apiEspooEvents]);
          }
        })
        .catch((error) => {
          console.error('Couldnt fetch data: ', error);
        })
    }

    
    //tapahtumalistan filtteröinti:
    const handleDrawerOpen = () => {
      setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
      setIsDrawerOpen(false);
    };

    const searchByEventName = (keyword) => {
      const filtered = events.filter((event) =>
        event.eventName && event.eventName.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredEvents(filtered);
    };

    const searchByCity = (keyword) => {
      const filtered = events.filter((event) => {
        //event.location && event.location?.city?.toLowerCase().includes(keyword.toLowerCase())
        let city;
        if (event.location.city) {
          city = event.location.city;
        } else {
          city = event.location;
        }

        return city && city.toLowerCase().includes(keyword.toLowerCase());
      });
      setFilteredEvents(filtered);
    };
    /*
      const searchByCategory = (keyword) => {
        const filtered = events.filter((event) =>
          event.category?.categoryName?.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredEvents(filtered);
      };*/
    //tämä ei hae tietokannasta ???
    const searchByCategory = (keyword) => {
      const filtered = events.filter((event) => {
        let category;

        if (event.category) {
          // H2-tietokannasta
          category = event.category//.categoryName; //hakee ainoastaan tietokannasta
        }
        else if (event.keywords && event.keywords.length > 0) {
          // yksi API keywordeistä
          category = event.keywords[0].name.fi || event.keywords[1].name.fi;
        } else if (event.category?.categoryName) {
          category = category.categoryName;
        }
        return category && typeof category === 'string' && category.toLowerCase().includes(keyword.toLowerCase());
      });
      setFilteredEvents(filtered);
    };


    const searchByDate = (keyword) => {
      if (!keyword) {
        setFilteredEvents(events); // Näytä kaikki tapahtumat, jos filtteriarvo on tyhjä
      } else {
        const filtered = events.filter((event) => {
          const startDate = new Date(event.startDate); // Olettaen että event.startDate on muotoa "yyyy-MM-dd"
          const searchDate = new Date(keyword); // Olettaen että keyword on muotoa "yyyy-MM-dd"
          const endDate = new Date(event.endDate); // Olettaen että keyword on muotoa "yyyy-MM-dd"
          startDate.setHours(0, 0, 0, 0);
          searchDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999)
          return ((startDate <= searchDate && searchDate <= endDate) ||
            startDate.getTime() === searchDate.getTime());  //vertallaan päivämääriä ilman aikaa
        });
        setFilteredEvents(filtered);
      }
    };
    const resetFilters = () => {
      setFilteredEvents([...events]);
    };

  //Tapahtuman lisätietojen näkymä:
    const [expandedEventId, setExpandedEventId] = useState(null);
    const handleExpandClick = (eventId) => {
      setExpandedEventId(eventId === expandedEventId ? null : eventId);
    };

  return (
      <Paper sx={{ width: "100%" }}>
        <Weather />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            type="text"
            placeholder="Search by event name"
            onChange={(e) => searchByEventName(e.target.value)}
          />
          <IconButton onClick={handleDrawerOpen}>
            <MenuIcon fontSize="medium" />
          </IconButton>
          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={handleDrawerClose}
          >
            <Box
              sx={{ width: 250 }}
              role="presentation"
            >
              <Typography variant="h6">Filter by:</Typography>
              <TextField
                type="text"
                placeholder="City"
                onChange={(e) => searchByCity(e.target.value)}
              />
              <TextField
                type="text"
                placeholder="Category"
                onChange={(e) => searchByCategory(e.target.value)}
              />
              <TextField
                type="date"
                placeholder="Date"
                onChange={(e) => searchByDate(e.target.value)}
              />
              <Box>
                <IconButton
                  size='small'
                  color='primary'
                  onClick={resetFilters}>Reset Filters </IconButton>
                <Box>
                  <IconButton
                    color="warning"
                    onClick={handleDrawerClose}>
                    <CloseIcon fontSize="medium" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Drawer>
        </Box>
        <Typography variant="h5">All events</Typography>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Event name</TableCell>
                <TableCell align="right">Starts</TableCell>
                <TableCell align="right">Ends</TableCell>
                <TableCell align="right">City</TableCell>
                <TableCell align="right">Category</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.map((event, index) => (
                <React.Fragment key={index}>

                <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {event.eventName}
                  </TableCell>
                  <TableCell align="right">{event.startDate}</TableCell>
                  <TableCell align="right">{event?.endDate ||'-'}</TableCell>
                  <TableCell align="right">{event.location?.city || event.location || 'N/A'}</TableCell>
                  <TableCell align="right">{event.category?.categoryName || event.category || 'N/A'}</TableCell>
                  <TableCell align="right">
                    <Button onClick={() => handleExpandClick(event.eventId)}>{expandedEventId === event.eventId ? 'Close Details' : 'View Details'}</Button>
                  </TableCell>
                  </TableRow>
                  {expandedEventId === event.eventId && (
                    <TableRow>
                      <TableCell colSpan={1}></TableCell>
                      <TableCell colSpan={2}>
                        <b>Price:</b> {event.price}<br />
                        <b>Address:</b> {event.streetAddress + ' ' + event.location.city || event.location.city || 'N/A'}
                      </TableCell>
                      <TableCell colSpan={3}>
                        <b>Description:</b> {event.description || 'N/A'}
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  export default FrontPage;