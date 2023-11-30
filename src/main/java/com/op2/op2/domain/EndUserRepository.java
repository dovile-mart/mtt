package com.op2.op2.domain;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

public interface EndUserRepository extends CrudRepository<EndUser, Long> {

    Optional<EndUser> findByUsername(String username);

    List<EndUser> findByUserId(Long userId);

}
