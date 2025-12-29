module car_game::garage {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event; 
    use std::string::{Self, String};

    // ===== Structs =====

    public struct Car has key, store {
        // TODO 1: Add fields (id, model, color, wheels, bumper)
        // Hint: wheels and bumper should be Option<Wheels> and Option<Bumper>
    }

    public struct Wheels has key, store {
        id: UID,
        style: String,
    }

    public struct Bumper has key, store {
        // TODO 2: Add fields for Bumper (id, material)
    }

    // ===== Events =====
    public struct CarModifiedEvent has copy, drop {
        // TODO 3: Add event fields (car_id, action_type)
    }

    // ===== Errors =====
    const ERR_NO_WHEELS_TO_REMOVE: u64 = 1;
    const ERR_NO_BUMPER_TO_REMOVE: u64 = 2;

    // ===== Functions =====

    public entry fun mint_car(model: vector<u8>, color: vector<u8>, ctx: &mut TxContext) {
        // TODO 4: Initialize Car with no wheels or bumper (Option::none())
        // and transfer to sender
    }

    public entry fun repaint_car(car: &mut Car, new_color: vector<u8>) {
        // TODO 5: Update the car's color and emit CarModifiedEvent
    }

    public entry fun create_wheels(style: vector<u8>, ctx: &mut TxContext) {
        // TODO 6: Mint Wheels and transfer to sender
    }

    public entry fun install_wheels(car: &mut Car, new_wheels: Wheels, ctx: &mut TxContext) {
        // TODO 7: Logic to put wheels inside the Car object
        // Hint: Handle old wheels if they exist!
    }

    public entry fun remove_wheels(car: &mut Car, ctx: &mut TxContext) {
        // TODO 8: Logic to take wheels out and send back to owner
    }
}