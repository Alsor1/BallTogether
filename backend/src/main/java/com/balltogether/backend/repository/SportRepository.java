/** Clasa pentru SportRepository
 * @author Avram Sorin-Alexandru
 * @version 10 January 2026
 */
package com.balltogether.backend.repository;

import com.balltogether.backend.entity.Sport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SportRepository extends JpaRepository<Sport, Long> {
}
