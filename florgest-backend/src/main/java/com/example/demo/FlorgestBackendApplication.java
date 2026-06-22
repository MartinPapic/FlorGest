package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.example.demo.model.Usuario;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.model.Producto;
import com.example.demo.repository.ProductoRepository;
import java.math.BigDecimal;
import java.util.Arrays;

@SpringBootApplication
public class FlorgestBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlorgestBackendApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, ProductoRepository productoRepository) {
		return args -> {
			if (usuarioRepository.count() == 0) {
				usuarioRepository.save(new Usuario("Admin Principal", "admin@florgest.com", "admin123", "ADMIN"));
				usuarioRepository.save(new Usuario("Vendedor Uno", "vendedor@florgest.com", "vendedor123", "VENDEDOR"));
				System.out.println("Usuarios iniciales (Admin y Vendedor) creados exitosamente.");
			}
			
			if (productoRepository.count() == 0) {
				productoRepository.saveAll(Arrays.asList(
					new Producto("Ramo de Rosas Rojas Premium", "Ramo", new BigDecimal("25000"), 15, "https://upload.wikimedia.org/wikipedia/commons/2/2f/Red_Roses.jpg"),
					new Producto("Arreglo de Tulipanes Holandeses", "Arreglo", new BigDecimal("45000"), 8, "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800&q=80"),
					new Producto("Girasoles de la Toscana", "Ramo", new BigDecimal("18500"), 20, "https://loremflickr.com/800/800/sunflower,flower?lock=20"),
					new Producto("Orquídea Phalaenopsis Blanca", "Planta", new BigDecimal("35000"), 5, "https://loremflickr.com/800/800/orchid,flower,white?lock=30"),
					new Producto("Bouquet Mixto Primaveral", "Bouquet", new BigDecimal("22000"), 12, "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800&q=80"),
					new Producto("Centro de Mesa Elegante", "Arreglo", new BigDecimal("55000"), 3, "https://loremflickr.com/800/800/centerpiece,flower?lock=40"),
					new Producto("Caja de Rosas Blancas de Lujo", "Caja", new BigDecimal("48000"), 6, "https://upload.wikimedia.org/wikipedia/commons/5/51/White_roses.jpg"),
					new Producto("Lirios Orientales Fragantes", "Ramo", new BigDecimal("28000"), 10, "https://loremflickr.com/800/800/lily,flower?lock=60")
				));
				System.out.println("Productos iniciales creados exitosamente.");
			}
		};
	}
}
