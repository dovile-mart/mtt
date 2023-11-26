package com.op2.op2.services;


import java.util.Optional;
import org.springframework.security.core.userdetails.User.UserBuilder;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


import com.op2.op2.domain.EndUser;
import com.op2.op2.domain.EndUserRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	private final EndUserRepository endUserRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;

	
	public UserDetailsServiceImpl(EndUserRepository endUserRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
		this.endUserRepository = endUserRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;

	}


	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<EndUser> user = endUserRepository.findByUsername(username);
		UserBuilder builder = null;
		if (user.isPresent()) {
			EndUser currentUser = user.get();
			builder = org.springframework.security.core.userdetails.User.withUsername(username);
			builder.password(currentUser.getPassword());
			builder.roles(currentUser.getRole());
		} else {
			throw new UsernameNotFoundException("User not found.");
		}
		return builder.build();
	}

	public void signNewUser(EndUser newUser){
		String encryptedPassword = bCryptPasswordEncoder.encode(newUser.getPassword());
		newUser.setPassword(encryptedPassword);

		endUserRepository.save(newUser);
	}	

	
}
