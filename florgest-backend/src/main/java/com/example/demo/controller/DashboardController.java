package com.example.demo.controller;

import com.example.demo.model.Producto;
import com.example.demo.model.Venta;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.repository.VentaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @GetMapping("/resumen")
    public Map<String, Object> getResumen() {
        Map<String, Object> resumen = new HashMap<>();

        // 1. Total Productos
        List<Producto> productos = productoRepository.findAll();
        resumen.put("totalProductos", productos.size());

        // 2. Stock Bajo (< 10)
        long stockBajo = productos.stream().filter(p -> p.getStock() < 10).count();
        resumen.put("stockBajo", stockBajo);

        // 3. Ventas del día
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        
        List<Venta> ventasHoy = ventaRepository.findAll().stream()
            .filter(v -> v.getFecha() != null && !v.getFecha().isBefore(startOfDay) && !v.getFecha().isAfter(endOfDay))
            .collect(Collectors.toList());

        BigDecimal totalVentas = ventasHoy.stream()
            .map(Venta::getTotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        resumen.put("ventasDelDia", totalVentas);
        
        return resumen;
    }
}
