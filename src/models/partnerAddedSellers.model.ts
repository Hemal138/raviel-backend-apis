import { Sequelize, DataTypes, Model } from "sequelize";
import { enums } from "../common/constants";
import { alternatives } from "joi";
type UUID = string & { readonly __brand: unique symbol };

const PartnerAddedSellers = (sequelize: Sequelize, DataTypes: any) => {
  class PartnerAddedSellers extends Model {
    public id!: UUID;
    public partnerId!: UUID;
    public sellerId!: string; // vendor id
    public sellerName!: string; // account holder name
    public brandName!: string; // account name
    public launchingDate!: string;
    public listingDate!: string;
    public sellerEmailId!: string;
    public phoneNumber!: string;
    public password!: string;
    public brandApproval!: string;
    public gstNumber!: string;
    public trademarkClass!: string;
    public totalSKUs!: number; 
    public pendingSKUs!: number;
    public liveSKUs!: number;
    public productCategories!: string[];
    public createdAt!: Date;
    public updatedAt!: Date | null;


    static associate(models: any) {
      //* define association here
      //   User.belongsTo(models.Role, {
      //     foreignKey: "role_id",
      //     as: "role",
      //   });
    }
  }

  PartnerAddedSellers.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      partnerId: {
        type: DataTypes.UUID,
        field: "partner_id",
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        }
      },
      sellerId: {
        type: DataTypes.STRING,
        field: "seller_id",
        allowNull: false,
        unique: true,
      },
      sellerName: {
        type: DataTypes.STRING,
        field: "seller_name",
        allowNull: false,
      },
      brandName: {
        type: DataTypes.STRING,
        field: "brand_name",
        allowNull: false,
      },
      launchingDate: {
        type: DataTypes.DATEONLY,
        field: "launching_date",
        allowNull: false,
      },
      listingDate: {
        type: DataTypes.DATEONLY,
        field: "listing_date",
        allowNull: false,
      },
      sellerEmailId: {
        type: DataTypes.STRING,
        field: "seller_email_id",
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        field: "phone_number",
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        field: "password",
        allowNull: false,
      },
      brandApproval: {
        type: DataTypes.ENUM("pending", "approved"),
        field: "brand_approval",
        allowNull: false,
      },
      gstNumber: {
        type: DataTypes.STRING,
        field: "gst_number",
        allowNull: false
      },
      trademarkClass: {
        type: DataTypes.ENUM("pending", "approved"),
        field: "trademark_class",
        allowNull: false
      },
      totalSKUs: {
        type: DataTypes.INTEGER,
        field: "total_skus",
        defaultValue: 0
      },
      pendingSKUs: {
        type: DataTypes.INTEGER,
        field: "pending_skus",
        defaultValue: 0
      },
      liveSKUs: {
        type: DataTypes.INTEGER,
        field: "live_skus",
        defaultValue: 0
      },
      productCategories: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false,    
        field: "product_categories",
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "PartnerAddedSellers",
      tableName: "partner_added_sellers",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
    }
  );
  return PartnerAddedSellers;
};

export default PartnerAddedSellers;
