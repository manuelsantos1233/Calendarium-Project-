package com.calendario.convivios.repository;

import com.calendario.convivios.model.Photo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PhotoRepository extends JpaRepository<Photo, Long> {
    List<Photo> findAllByOrderByDateDescUploadedAtDesc();

    List<Photo> findByDateOrderByUploadedAtDesc(LocalDate date);
}
