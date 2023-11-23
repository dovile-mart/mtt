package com.op2.op2.domain;

import org.springframework.data.repository.CrudRepository;
import java.util.List;


public interface EventRepository extends CrudRepository<Event, Long> {
    
    List<Event> findByEventName(String eventName);

    Event findByEventId(long eventId);
    List<Event> findByLocation(Location location);
    List<Event> findByCategory(Category category);
    List<Event> findByIndoorEvent(boolean indoorEvent);
}
