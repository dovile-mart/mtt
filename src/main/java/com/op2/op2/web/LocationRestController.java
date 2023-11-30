package com.op2.op2.web;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.op2.op2.domain.Location;
import com.op2.op2.domain.LocationRepository;

import io.swagger.v3.oas.annotations.tags.Tag;


@RestController
@CrossOrigin("http://localhost:5173")
@Tag(name="Location REST", description="Information on locations")
public class LocationRestController {
    private final Logger log = LoggerFactory.getLogger(LocationRestController.class);

    @Autowired
    private LocationRepository locationRepo;

    //get all locations json
    @GetMapping({ "/locations" })
    public @ResponseBody List<Location> findAllLocations() {
        log.info("Fetch all locations");
        try {
            return (List<Location>) locationRepo.findAll();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No locations found");
        }
    }

    //get location by id json
    @GetMapping({ "/locations/{id}" })
    public @ResponseBody Optional<Location> getLocationById(@PathVariable("id") Long locationId) {
        log.info("Fetch location by id");
        try{
            return locationRepo.findById(locationId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find a location");
        }
    }

    //save new location
    @PostMapping({ "/locations" })
    public @ResponseBody Location saveLocationRest(@RequestBody Location location) {
        return locationRepo.save(location);
    }


    //delete location
    @DeleteMapping({ "/locations/{id}" })
    void deleteLocation(@PathVariable("id") Long locationId) {
        log.info("Location id has been marked as deleted: " + locationId);
        try {
            locationRepo.deleteById(locationId);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find location with id " + locationId);
        }
    }

    @PutMapping({ "/locations/{id}" })
    @ResponseStatus(HttpStatus.CREATED)
    public Location updateLocation(@RequestBody Location updatedLocation, @PathVariable("id") Long locationId) {
        log.info("Edited location " + updatedLocation.toString());
        Optional<Location> location = locationRepo.findById(locationId);
        if (location.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find location");
        }
        try{
            updatedLocation.setLocationId(locationId);
            return locationRepo.save(updatedLocation);
        } catch (Exception e){
            throw new ResponseStatusException(HttpStatus.NOT_ACCEPTABLE, "Could not accept");
        }
    }
}
