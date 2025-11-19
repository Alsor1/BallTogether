package com.balltogether.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import com.balltogether.backend.entity.Users;

@Entity
@Table(name = "referees")
@Data
@NoArgsConstructor
public class Referee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "referee_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private Users user;

    private String bio;

    @Column(name = "rate_per_hour")
    private BigDecimal ratePerHour;
}