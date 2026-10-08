package com.panha.modal;

import java.time.LocalTime;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import lombok.Data;

@Entity
@Data
public class Salon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    @ElementCollection
    @CollectionTable(
            name = "salon_images",
            joinColumns = @JoinColumn(name = "salon_id")
    )
    @Column(columnDefinition = "LONGTEXT")
    private List<String> image;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String pincode;

    /**
     * ID of the User from User Service.
     */
    @Column(nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private LocalTime openTime;

    @Column(name = "close_time")
    private LocalTime closeTime;
}
