module car_game::garage {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event; // Event sistemi eklendi
    use std::string::{Self, String};

    // ===== Structs =====

    public struct Car has key, store {
       
    }

    public struct Wheels has key, store {
        id: UID,
        style: String,
    }

    public struct Bumper has key, store {
    }

    // ===== Events =====
    public struct CarModifiedEvent has copy, drop {
    }

    // ===== Errors =====
    const ERR_NO_WHEELS_TO_REMOVE: u64 = 1;
    const ERR_NO_BUMPER_TO_REMOVE: u64 = 2;

    // ===== Functions =====

    public entry fun mint_car(model: vector<u8>, color: vector<u8>, ctx: &mut TxContext) {
    }

    public entry fun repaint_car(car: &mut Car, new_color: vector<u8>) {
    }

    // Dikkat: Gerçek bir oyunda buraya 'AdminCap' veya 'Coin' eklenmeli!
    public entry fun create_wheels(style: vector<u8>, ctx: &mut TxContext) {
    }

    public entry fun install_wheels(car: &mut Car, new_wheels: Wheels, ctx: &mut TxContext) {
        };
    }
