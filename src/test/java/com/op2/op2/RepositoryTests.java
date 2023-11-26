package com.op2.op2;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

import com.op2.op2.domain.Event;
import com.op2.op2.domain.EventRepository;

@DataJpaTest
public class RepositoryTests {

    @Autowired
    EventRepository eventRepository;

    @Test
    public void findByEventNameShouldReturnListSize() {
        Event event = new Event("Some test event name2", LocalDate.now(), null, "test description", 100, "Mannerheimintie 1");
        eventRepository.save(event);
        List<Event> eventsByName = eventRepository.findByEventName("Some test event name2");
        assertEquals(eventsByName.size(), 1); //(Assert that expected and actual are equal within the given non-negative delta.)
    }

    @Test
    public void saveNewEvent() {
        //Event(String eventName, LocalDate date, String description, double price)
        Event event = new Event("test event", LocalDate.now(), null, "test description", 100, "Mannerheimintie 1");
        eventRepository.save(event);
        assertThat(event.getEventId()).isNotNull();
    }

     @Test
     public void saveNewEmptyEvent() {
         Event event = new Event("Not empty", LocalDate.now(), null, null, 0, null);
         eventRepository.save(event);
         assertThat(event.getEventId()).isNotNull();
    }
    
    @Test
    public void updateEventName() {
        Event event = new Event("Some test event name", LocalDate.now(), null, "test description", 100, "Mannerheimintie 1");
        eventRepository.save(event);
        Optional<Event> eventbyid = eventRepository.findById((long) event.getEventId());
        assertNotEquals(eventbyid.get().getEventId(), null);
        eventbyid.get().setEventName("Changed event name");
        List<Event> events = eventRepository.findByEventName("Changed event name");
        assertThat(events).hasSize(1);
    }
    @Test
    public void deleteEvent() {
        Event newevent = new Event("Test event name", LocalDate.now(), null, "test description", 100, "Mannerheimintie 1");
        eventRepository.save(newevent);
       
        eventRepository.deleteById(newevent.getEventId());
 
        List<Event> listnewevent = eventRepository.findByEventName("Test event name");
        assertThat(listnewevent).hasSize(0);
    }
}
