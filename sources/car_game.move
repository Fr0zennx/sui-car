module car_game::garage {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event; 
    use std::string::{Self, String};
    use std::option::{Self, Option};

    // ===== Structs =====

    public struct Car has key, store {
        id: UID,
        model: String,
        color: String,
        wheels: Option<Wheels>,
        bumper: Option<Bumper>,
    }

    public struct Wheels has key, store {
        id: UID,
        style: String,
    }

    public struct Bumper has key, store {
        id: UID,
        material: String,
    }

    // ===== Events =====

    public struct CarModifiedEvent has copy, drop {
        car_id: ID,
        action_type: String,
    }

    // ===== Errors =====

    const ERR_NO_WHEELS_TO_REMOVE: u64 = 1;
    const ERR_NO_BUMPER_TO_REMOVE: u64 = 2;

    // ===== Functions =====

    /// Create a new car with no parts and send it to the creator
    public entry fun mint_car(model: vector<u8>, color: vector<u8>, ctx: &mut TxContext) {
        let car = Car {
            id: object::new(ctx),
            model: string::utf8(model),
            color: string::utf8(color),
            wheels: option::none(),
            bumper: option::none(),
        };
        
        transfer::public_transfer(car, tx_context::sender(ctx));
    }

    /// Update the car's color and emit an event
    public entry fun repaint_car(car: &mut Car, new_color: vector<u8>) {
        car.color = string::utf8(new_color);

        event::emit(CarModifiedEvent {
            car_id: object::uid_to_inner(&car.id),
            action_type: string::utf8(b"Repaint"),
        });
    }

    /// Create wheels to be installed later
    public entry fun create_wheels(style: vector<u8>, ctx: &mut TxContext) {
        let wheels = Wheels {
            id: object::new(ctx),
            style: string::utf8(style),
        };
        transfer::public_transfer(wheels, tx_context::sender(ctx));
    }

    /// Install wheels into the car. If the car already has wheels, 
    /// the old ones are sent back to the owner.
    public entry fun install_wheels(car: &mut Car, new_wheels: Wheels, ctx: &mut TxContext) {
        // If there are already wheels, extract them and send back to owner
        if (option::is_some(&car.wheels)) {
            let old_wheels = option::extract(&mut car.wheels);
            transfer::public_transfer(old_wheels, tx_context::sender(ctx));
        };

        option::fill(&mut car.wheels, new_wheels);

        event::emit(CarModifiedEvent {
            car_id: object::uid_to_inner(&car.id),
            action_type: string::utf8(b"Install Wheels"),
        });
    }

    /// Remove wheels from the car and send them to the owner's wallet
    public entry fun remove_wheels(car: &mut Car, ctx: &mut TxContext) {
        assert!(option::is_some(&car.wheels), ERR_NO_WHEELS_TO_REMOVE);

        let wheels = option::extract(&mut car.wheels);
        transfer::public_transfer(wheels, tx_context::sender(ctx));

        event::emit(CarModifiedEvent {
            car_id: object::uid_to_inner(&car.id),
            action_type: string::utf8(b"Remove Wheels"),
        });
    }

    /// Bonus: Logic for Bumper (similar to wheels)
    public entry fun create_bumper(material: vector<u8>, ctx: &mut TxContext) {
        let bumper = Bumper {
            id: object::new(ctx),
            material: string::utf8(material),
        };
        transfer::public_transfer(bumper, tx_context::sender(ctx));
    }
}