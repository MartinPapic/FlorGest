package com.example.demo.controller;

import com.example.demo.model.Producto;
import com.example.demo.model.Venta;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/ventas")
@CrossOrigin(origins = "*")
public class VentaController {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping
    public List<Venta> getAllVentas() {
        return ventaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> registrarVenta(@RequestBody Venta venta) {
        Optional<Producto> productoOpt = productoRepository.findById(venta.getProductoId());
        
        if (productoOpt.isPresent()) {
            Producto producto = productoOpt.get();
            
            // Validar stock
            if (producto.getStock() < venta.getCantidad()) {
                Map<String, String> response = new HashMap<>();
                response.put("error", "Stock insuficiente");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            
            // Descontar stock
            producto.setStock(producto.getStock() - venta.getCantidad());
            productoRepository.save(producto);
            
            if (venta.getFecha() == null) {
                venta.setFecha(LocalDateTime.now());
            }
            
            Venta nuevaVenta = ventaRepository.save(venta);
            return ResponseEntity.ok(nuevaVenta);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Producto no encontrado");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<Venta> ventaOpt = ventaRepository.findById(id);
        if (ventaOpt.isPresent()) {
            Venta venta = ventaOpt.get();
            venta.setEstado(payload.get("estado"));
            ventaRepository.save(venta);
            return ResponseEntity.ok(venta);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Venta no encontrada");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
