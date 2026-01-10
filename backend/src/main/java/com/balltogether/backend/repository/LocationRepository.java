/** Repository pentru Locatii folosind SQL nativ
 * @author [Your Name]
 */
package com.balltogether.backend.repository;

import com.balltogether.backend.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {

    // Folosim JPQL pentru a încărca și relațiile (sports)
    @Query("SELECT DISTINCT l FROM Location l LEFT JOIN FETCH l.sports")
    List<Location> findAllLocationsNative();
    
    @Query("SELECT l FROM Location l LEFT JOIN FETCH l.sports WHERE l.id = :id")
    java.util.Optional<Location> findByIdNative(@Param("id") Long id);
}