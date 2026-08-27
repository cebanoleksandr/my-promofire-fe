const CreateCampaignPage = () => {
  return (
    <div>
      <h1>Create Campaign</h1>
      <form>
        <div>
          <label>Name:</label>
          <input type="text" />
        </div>
        <div>
          <label>Discount Type:</label>
          <select>
            <option value="percentage">Percentage</option>
            <option value="fixed_amount">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label>Discount Value:</label>
          <input type="number" />
        </div>
        <div>
          <label>Starts At:</label>
          <input type="datetime-local" />
        </div>
        <div>
          <label>Expires At:</label>
          <input type="datetime-local" />
        </div>
        <div>
          <label>Total Codes Limit:</label>
          <input type="number" />
        </div>
        <div>
          <label>Per Customer Limit:</label>
          <input type="number" />
        </div>
        <button type="submit">Create Campaign</button>
      </form>
    </div>
  );
};

export default CreateCampaignPage;
