package com.balltogether.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")  // Adaugă numele corect al coloanei din DB
    private Long id;

    @ManyToOne
    @JoinColumn(name = "host_user_id")
    private Users host;

    @ManyToMany
    @JoinTable(
        name = "event_participants",
        joinColumns = @JoinColumn(name = "event_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<Users> participants = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @ManyToOne
    @JoinColumn(name = "sport_id")
    private Sport sport;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "status")
    private String status;

    // Default constructor
    public Event() {}

    // Getters
    public Long getId() {
        return id;
    }

    public Users getHost() {
        return host;
    }

    public Set<Users> getParticipants() {
        return participants;
    }

    public Location getLocation() {
        return location;
    }

    public Sport getSport() {
        return sport;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public String getStatus() {
        return status;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setHost(Users host) {
        this.host = host;
    }

    public void setParticipants(Set<Users> participants) {
        this.participants = participants;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public void setSport(Sport sport) {
        this.sport = sport;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}