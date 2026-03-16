
package com.ivr.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ivr.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
