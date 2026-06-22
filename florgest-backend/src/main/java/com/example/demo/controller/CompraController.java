package com.example.demo.controller;

import com.example.demo.model.Compra;
import com.example.demo.model.Producto;
import com.example.demo.repository.CompraRepository;
import com.example.demo.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/compras")
@CrossOrigin(origins = "*")
public class CompraController {

    @Autowired
    private CompraRepository compraRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Compra> getAllCompras() {
        return compraRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> registrarCompra(@RequestBody Compra compra) {
        // Validar que el producto existe
        Optional<Producto> productoOpt = productoRepository.findById(compra.getProductoId());
        
        if (productoOpt.isPresent()) {
            Producto producto = productoOpt.get();
            // Aumentar el stock del producto
            producto.setStock(producto.getStock() + compra.getCantidad());
            productoRepository.save(producto);
            
            // Asignar la fecha actual si no viene
            if (compra.getFecha() == null) {
                compra.setFecha(LocalDateTime.now());
            }
            
            Compra nuevaCompra = compraRepository.save(compra);
            return ResponseEntity.ok(nuevaCompra);
        } else {
            return ResponseEntity.badRequest().body("{\"error\": \"Producto no encontrado\"}");
        }
    }
}
