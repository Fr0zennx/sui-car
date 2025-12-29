module car_game::garage {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event; // Event sistemi eklendi
    use std::string::{Self, String};

    // ===== Structs =====

    public struct Car has key, store {
        id: UID,
        model: String,
        color: String,
        wheels: std::option::Option<Wheels>,
        bumper: std::option::Option<Bumper>,
    }

    public struct Wheels has key, store {
        id: UID,
        style: String,
    }

    public struct Bumper has key, store {
        id: UID,
        shape: String,
    }

    // ===== Events =====
    // Frontend'in anlık güncelleme yapması için çok kritik
    public struct CarModifiedEvent has copy, drop {
        car_id: ID,
        action: String, // "REPAINT", "WHEELS_INSTALLED", etc.
        new_value: String,
    }

    // ===== Errors =====
    const ERR_NO_WHEELS_TO_REMOVE: u64 = 1;
    const ERR_NO_BUMPER_TO_REMOVE: u64 = 2;

    // ===== Functions =====

    public entry fun mint_car(model: vector<u8>, color: vector<u8>, ctx: &mut TxContext) {
        let car = Car {
            id: object::new(ctx),
            model: string::utf8(model),
            color: string::utf8(color),
            wheels: std::option::none(),
            bumper: std::option::none(),
        };
        transfer::public_transfer(car, tx_context::sender(ctx));
    }

    public entry fun repaint_car(car: &mut Car, new_color: vector<u8>) {
        let color_str = string::utf8(new_color);
        car.color = color_str;

        event::emit(CarModifiedEvent {
            car_id: object::id(car),
            action: string::utf8(b"REPAINT"),
            new_value: color_str,
        });
    }

    // Dikkat: Gerçek bir oyunda buraya 'AdminCap' veya 'Coin' eklenmeli!
    public entry fun create_wheels(style: vector<u8>, ctx: &mut TxContext) {
        let wheels = Wheels {
            id: object::new(ctx),
            style: string::utf8(style),
        };
        transfer::public_transfer(wheels, tx_context::sender(ctx));
    }

    public entry fun install_wheels(car: &mut Car, new_wheels: Wheels, ctx: &mut TxContext) {
        let wheels_style = new_wheels.style;
        let mut old_wheels = std::option::swap_or_fill(&mut car.wheels, new_wheels);
        
        if (std::option::is_some(&old_wheels)) {
            let wheels = std::option::extract(&mut old_wheels);
            transfer::public_transfer(wheels, tx_context::sender(ctx));
        };
        std::option::destroy_none(old_wheels);

        event::emit(CarModifiedEvent {
            car_id: object::id(car),
            action: string::utf8(b"WHEELS_INSTALLED"),
            new_value: wheels_style,
        });
    }

    // ... create_bumper ve install_bumper benzer şekilde event eklenerek güncellenebilir
}