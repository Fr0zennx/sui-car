module car_game::garage {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event; 
    use std::string::{Self, String};
    use std::option::{Self, Option};

    // ===== CHAPTER 1: DATA STRUCTURES =====

    public struct Car has key, store {
        id: UID,
        // MISSION: Add model (String) and color (String).
        // MISSION: Add optional parts: wheels and bumper.
        // HINT: Use Option<Wheels> and Option<Bumper>.
        
    }

    public struct Wheels has key, store {
        id: UID,
        style: String,
    }

    public struct Bumper has key, store {
        id: UID,
        // MISSION: Add a material field of type String.
        
    }

    // ===== CHAPTER 2: EVENTS =====

    public struct CarModifiedEvent has copy, drop {
        // MISSION: Add fields to track which car was modified and what happened.
        // Requirements: car_id (ID) and action_type (String).
        
    }

    // ===== CHAPTER 3: ERROR CODES =====
    const ERR_NO_WHEELS_TO_REMOVE: u64 = 1;
    const ERR_NO_BUMPER_TO_REMOVE: u64 = 2;

    // ===== CHAPTER 4: MINTING =====

    /// MISSION: Create a new car and transfer it to the sender.
    /// Requirements: Initialize the car with NO wheels and NO bumper (Option::none()).
    public entry fun mint_car(model: vector<u8>, color: vector<u8>, ctx: &mut TxContext) {
        // TODO: Create the Car object and transfer it.
    }

    // ===== CHAPTER 5: MODIFICATION & EVENTS =====

    /// MISSION: Update the car's color and emit a CarModifiedEvent.
    public entry fun repaint_car(car: &mut Car, new_color: vector<u8>) {
        // TODO: Update color field.
        // TODO: Emit CarModifiedEvent with action type "Repaint".
    }

    // ===== CHAPTER 6: COMPOSABILITY (PARTS) =====

    /// MISSION: Create wheels and send them to the sender.
    public entry fun create_wheels(style: vector<u8>, ctx: &mut TxContext) {
        // TODO: Initialize Wheels and use public_transfer.
    }

    /// MISSION: Create a bumper but RETURN it (to be used in a Programmable Transaction Block).
    public fun new_bumper(material: vector<u8>, ctx: &mut TxContext): Bumper {
        // TODO: Initialize and return Bumper.
    }

    // ===== CHAPTER 7: INSTALLATION & REMOVAL =====

    /// MISSION: Logic to put wheels inside the Car object.
    /// Steps: 
    /// 1. Check if the car already has wheels. 
    /// 2. If it does, extract the old wheels and send them back to the owner.
    /// 3. Fill the empty slot with the new_wheels.
    public entry fun install_wheels(car: &mut Car, new_wheels: Wheels, ctx: &mut TxContext) {
        // TODO: Handle existing wheels using option::is_some and option::extract.
        // TODO: Place new_wheels using option::fill.
        // TODO: Emit event.
    }

    /// MISSION: Take wheels out of the car and send them back to the owner.
    public entry fun remove_wheels(car: &mut Car, ctx: &mut TxContext) {
        // TODO: Add an assertion to ensure wheels exist.
        // TODO: Extract wheels and transfer back to sender.
        // TODO: Emit event.
    }

    /// MISSION: Install a bumper into the car slot.
    public entry fun install_bumper(car: &mut Car, new_bumper: Bumper, ctx: &mut TxContext) {
        // TODO: Implementation similar to install_wheels.
    }

    /// MISSION: Remove a bumper from the car slot.
    public entry fun remove_bumper(car: &mut Car, ctx: &mut TxContext) {
        // TODO: Implementation similar to remove_wheels.
    }
}