package com.logic.controller;


import com.logic.DTO.HotelInfoDTO;
import com.logic.DTO.HotelInfoRequestDTO;
import com.logic.DTO.HotelPriceResponseDTO;
import com.logic.DTO.HotelSearchRequest;
import com.logic.Service.HotelService;
import com.logic.Service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelBrowseController {
    private final InventoryService inventoryService;
    private final HotelService hotelService;

    @PostMapping("/search")
    public ResponseEntity<Page<HotelPriceResponseDTO>> searchHotels(
            @RequestBody HotelSearchRequest hotelSearchRequest) {
        System.out.println(hotelSearchRequest);
        System.out.println("City = " + hotelSearchRequest.getCity());
        System.out.println("Start = " + hotelSearchRequest.getStartDate());
        System.out.println("End = " + hotelSearchRequest.getEndDate());
        System.out.println("Rooms = " + hotelSearchRequest.getRoomsCount());
        Page<HotelPriceResponseDTO> page =
                inventoryService.searchHotelsWithPrices(hotelSearchRequest);

        return ResponseEntity.ok(page);
    }

    @PostMapping("/{hotelId}/info")
    public ResponseEntity<HotelInfoDTO> getHotelInfo(@PathVariable Long hotelId,
                                                     @RequestBody(required = false) HotelInfoRequestDTO hotelInfoRequestDTO) {
        return ResponseEntity.ok(hotelService.getHotelInfoById(hotelId, hotelInfoRequestDTO));
    }
}
