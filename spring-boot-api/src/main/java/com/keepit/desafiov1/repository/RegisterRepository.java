package com.keepit.desafiov1.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.keepit.desafiov1.models.Registro;

@Service
public interface RegisterRepository extends JpaRepository<Registro, Long> {

    @Query("SELECT u FROM Registro u WHERE u.siglaRegiao = :regiao")
    Page<Registro> obterRegistrorPorRegiao(String regiao, Pageable pageable);

}
