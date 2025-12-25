module car_game::garage {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use std::string::{Self, String};

    // ===== Structs =====

    /// Ana Araba Nesnesi
    public struct Car has key, store {
        id: UID,
        model: String,
        color: String,
        wheels: std::option::Option<Wheels>,
        bumper: std::option::Option<Bumper>,
    }

    /// Jant Nesnesi
    public struct Wheels has key, store {
        id: UID,
        style: String,
    }

    /// Tampon Nesnesi
    public struct Bumper has key, store {
        id: UID,
        shape: String,
    }

    /// Eski parçaları saklayan event
    public struct OldPart has copy, drop {
        part_type: String,
    }

    // ===== Errors =====

    const ERR_NO_WHEELS_TO_REMOVE: u64 = 1;
    const ERR_NO_BUMPER_TO_REMOVE: u64 = 2;

    // ===== Public Functions =====

    /// 1. Yeni bir araba oluşturma
    public entry fun mint_car(
        model: vector<u8>,
        color: vector<u8>,
        ctx: &mut TxContext
    ) {
        let car = Car {
            id: object::new(ctx),
            model: string::utf8(model),
            color: string::utf8(color),
            wheels: std::option::none(),
            bumper: std::option::none(),
        };
        transfer::public_transfer(car, tx_context::sender(ctx));
    }

    /// 2. Arabanın rengini değiştirme (Mutation)
    public entry fun repaint_car(car: &mut Car, new_color: vector<u8>) {
        car.color = string::utf8(new_color);
    }

    /// 3. Jant oluşturma
    public entry fun create_wheels(
        style: vector<u8>,
        ctx: &mut TxContext
    ) {
        let wheels = Wheels {
            id: object::new(ctx),
            style: string::utf8(style),
        };
        transfer::public_transfer(wheels, tx_context::sender(ctx));
    }

    /// 4. Tampon oluşturma
    public entry fun create_bumper(
        shape: vector<u8>,
        ctx: &mut TxContext
    ) {
        let bumper = Bumper {
            id: object::new(ctx),
            shape: string::utf8(shape),
        };
        transfer::public_transfer(bumper, tx_context::sender(ctx));
    }

    /// 5. Jant takma ve eski olanı geri döndürme
    public entry fun install_wheels(
        car: &mut Car,
        new_wheels: Wheels,
        ctx: &mut TxContext
    ) {
        let old_wheels = std::option::swap_or_fill(&mut car.wheels, new_wheels);
        
        // Eğer eski jant varsa, kullanıcıya geri gönder
        if (std::option::is_some(&old_wheels)) {
            let wheels = std::option::extract(&mut old_wheels);
            transfer::public_transfer(wheels, tx_context::sender(ctx));
        };
    }

    /// 6. Tampon takma ve eski olanı geri döndürme
    public entry fun install_bumper(
        car: &mut Car,
        new_bumper: Bumper,
        ctx: &mut TxContext
    ) {
        let old_bumper = std::option::swap_or_fill(&mut car.bumper, new_bumper);
        
        // Eğer eski tampon varsa, kullanıcıya geri gönder
        if (std::option::is_some(&old_bumper)) {
            let bumper = std::option::extract(&mut old_bumper);
            transfer::public_transfer(bumper, tx_context::sender(ctx));
        };
    }

    /// 7. Jant çıkartma
    public entry fun remove_wheels(
        car: &mut Car,
        ctx: &mut TxContext
    ) {
        assert!(std::option::is_some(&car.wheels), ERR_NO_WHEELS_TO_REMOVE);
        let wheels = std::option::extract(&mut car.wheels);
        transfer::public_transfer(wheels, tx_context::sender(ctx));
    }

    /// 8. Tampon çıkartma
    public entry fun remove_bumper(
        car: &mut Car,
        ctx: &mut TxContext
    ) {
        assert!(std::option::is_some(&car.bumper), ERR_NO_BUMPER_TO_REMOVE);
        let bumper = std::option::extract(&mut car.bumper);
        transfer::public_transfer(bumper, tx_context::sender(ctx));
    }

    // ===== View Functions =====

    /// Arabanın rengini görüntüle
    public fun get_color(car: &Car): String {
        car.color
    }

    /// Arabanın modelini görüntüle
    public fun get_model(car: &Car): String {
        car.model
    }

    /// Arabanın jantı takılı mı?
    public fun has_wheels(car: &Car): bool {
        std::option::is_some(&car.wheels)
    }

    /// Arabanın tamponu takılı mı?
    public fun has_bumper(car: &Car): bool {
        std::option::is_some(&car.bumper)
    }

    /// Jantın stilini görüntüle
    public fun get_wheels_style(wheels: &Wheels): String {
        wheels.style
    }

    /// Tamponun şeklini görüntüle
    public fun get_bumper_shape(bumper: &Bumper): String {
        bumper.shape
    }
}
