package com.op2.op2.domain;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Entity
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long eventId;
    @Size(min = 1, max = 30, message = "Name must be between 1 and 30 characters")
    @NotEmpty(message = "Name cannot be empty")
    private String eventName;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull(message = "Starting date is required")
    private LocalDate startDate;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @Nullable //when editing event it allows to set endDate as null
    private LocalDate endDate;
    private String description;
    private double price;
    private String streetAddress;
    private boolean indoorEvent;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "locationId")
    private Location location;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoryName")
    private Category category;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "username")
    private EndUser endUser;

    public Event() {

    }

    public Event(String eventName, LocalDate startDate, LocalDate endDate, String description, double price, String streetAddress) {
        super();
        this.eventName = eventName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.price = price;
        this.streetAddress = streetAddress;
        
    }

    public Event(String eventName, LocalDate startDate, LocalDate endDate, String description, double price, String streetAddress, Location location) {
        super();
        this.eventName = eventName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.price = price;
        this.streetAddress = streetAddress;
        this.location = location;
    }

    public Event(String eventName, LocalDate startDate, LocalDate endDate, String description, double price, String streetAddress, Location location,
            Category category) {
        super();
        this.eventName = eventName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.price = price;
        this.streetAddress = streetAddress;
        this.location = location;
        this.category = category;
    }

        public Event(String eventName, LocalDate startDate, LocalDate endDate, String description, double price, String streetAddress, Location location,
            Category category, EndUser endUser, boolean indoorEvent) {
        super();
        this.eventName = eventName;
        this.startDate = startDate;
        this.endDate = endDate;
        this.description = description;
        this.price = price;
        this.streetAddress = streetAddress;
        this.location = location;
        this.category = category;
        this.endUser = endUser;
        this.indoorEvent = indoorEvent;
    }


    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }
    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public EndUser getEndUser() {
        return endUser;
    }

    public void setEndUser(EndUser endUser) {
        this.endUser = endUser;
    }

    public boolean isIndoorEvent() {
        return indoorEvent;
    }

    public void setIndoorEvent(boolean indoorEvent) {
        this.indoorEvent = indoorEvent;
    }

    /*
     * @Override
     * public String toString() {
     * return "Event [eventId = " + eventId + " eventName = " + eventName +
     * " date = " + date + " description = " + description + " price = " + price +
     * "]";
     * }
     
    * @Override
    * public String toString() {
    *     return "Event [eventId = " + eventId + " eventName = " + eventName + " date = " + date + " description = "
    *             + description + " price = " + price + ", location=" + location + "]";
    * }
    */
    @Override
    public String toString() {
        return "Event [eventId = " + eventId + " eventName = " + eventName + " startDate = " + startDate + " endDate = " + endDate+ " description = "
                + description + " price = " + price + " streetaddress =" + streetAddress+ " location=" + location + " category = " + category + " endUser = " + endUser + " indoorEvent = " + indoorEvent + "]";
    }
}
